-- MeetPlan - Base de Datos Principal (PostgreSQL)


-- 1) Roles y seguridad
CREATE ROLE meetplan_admin LOGIN PASSWORD 'CambiaEstaClaveSegura';
CREATE ROLE meetplan_app   LOGIN PASSWORD 'CambiaEstaClaveApp';
CREATE DATABASE meetplan OWNER meetplan_admin;



-- 2) Extensiones y esquema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE SCHEMA IF NOT EXISTS app AUTHORIZATION meetplan_admin;

-- 3) Tipos ENUM
CREATE TYPE app.role_enum                AS ENUM ('user','admin');
CREATE TYPE app.meeting_status_enum      AS ENUM ('scheduled','completed','cancelled');
CREATE TYPE app.participant_role_enum    AS ENUM ('participant','moderator','observer');
CREATE TYPE app.participant_response_enum AS ENUM ('accepted','declined','tentative');
CREATE TYPE app.task_status_enum         AS ENUM ('pending','in_progress','completed','blocked');
CREATE TYPE app.task_priority_enum       AS ENUM ('low','medium','high','urgent');
CREATE TYPE app.notification_channel_enum AS ENUM ('email','in_app');
CREATE TYPE app.notification_template_enum AS ENUM ('meeting_reminder','task_due','task_assigned');
CREATE TYPE app.notification_status_enum AS ENUM ('scheduled','sent','failed','cancelled');

-- 4) Tabla: users
CREATE TABLE app.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email CITEXT UNIQUE NOT NULL,
  password_hash VARCHAR(512) NOT NULL,
  full_name TEXT NOT NULL,
  role app.role_enum NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5) Tabla: meetings
CREATE TABLE app.meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
  created_by UUID REFERENCES app.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  status app.meeting_status_enum NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_time_range CHECK (end_at > start_at)
);

-- 6) Tabla: meeting_participants
CREATE TABLE app.meeting_participants (
  meeting_id UUID NOT NULL REFERENCES app.meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
  role app.participant_role_enum NOT NULL DEFAULT 'participant',
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  response app.participant_response_enum,
  PRIMARY KEY (meeting_id, user_id)
);

-- 7) Tabla: tasks
CREATE TABLE app.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES app.meetings(id) ON DELETE SET NULL,
  assignee_id UUID REFERENCES app.users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES app.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status app.task_status_enum NOT NULL DEFAULT 'pending',
  priority app.task_priority_enum NOT NULL DEFAULT 'medium',
  due_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_due_completed CHECK (completed_at IS NULL OR (due_at IS NULL OR completed_at >= due_at)),
  CONSTRAINT chk_completed_time_status CHECK (
    (status = 'completed' AND completed_at IS NOT NULL)
    OR (status <> 'completed' AND completed_at IS NULL)
  )
);

-- 8) Tabla: task_activity
CREATE TABLE app.task_activity (
  id BIGSERIAL PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES app.tasks(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES app.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('create','update','status_change','assign','comment')),
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9) Tabla: notifications
CREATE TABLE app.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
  meeting_id UUID REFERENCES app.meetings(id) ON DELETE CASCADE,
  task_id UUID REFERENCES app.tasks(id) ON DELETE CASCADE,
  channel app.notification_channel_enum NOT NULL,
  template app.notification_template_enum NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status app.notification_status_enum NOT NULL DEFAULT 'scheduled',
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_target_presence CHECK (
    (template = 'meeting_reminder' AND meeting_id IS NOT NULL)
    OR (template IN ('task_due','task_assigned') AND task_id IS NOT NULL)
  )
);

-- 10) Tabla: attachments
CREATE TABLE app.attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES app.meetings(id) ON DELETE CASCADE,
  task_id UUID REFERENCES app.tasks(id) ON DELETE CASCADE,
  uploader_id UUID NOT NULL REFERENCES app.users(id) ON DELETE SET NULL,
  filename TEXT NOT NULL,
  url TEXT NOT NULL CHECK (url ~ '^https?://'),
  mime_type TEXT,
  size_bytes BIGINT CHECK (size_bytes IS NULL OR size_bytes >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11) Etiquetas
CREATE TABLE app.labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE app.task_labels (
  task_id UUID NOT NULL REFERENCES app.tasks(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES app.labels(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, label_id)
);

CREATE TABLE app.meeting_labels (
  meeting_id UUID NOT NULL REFERENCES app.meetings(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES app.labels(id) ON DELETE CASCADE,
  PRIMARY KEY (meeting_id, label_id)
);

-- 12) Triggers de updated_at
CREATE OR REPLACE FUNCTION app.touch_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON app.users
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_meetings_updated_at
BEFORE UPDATE ON app.meetings
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

CREATE TRIGGER trg_tasks_updated_at
BEFORE UPDATE ON app.tasks
FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at();

-- 13) Permisos mínimos
GRANT USAGE ON SCHEMA app TO meetplan_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO meetplan_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app TO meetplan_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA app
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO meetplan_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA app
GRANT USAGE, SELECT ON SEQUENCES TO meetplan_app;

-- 14) Zona horaria
ALTER DATABASE meetplan SET timezone TO 'UTC';
