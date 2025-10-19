import express from 'express';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import { authMiddleware } from './middlewares/auth.middleware';
import meetingRoutes from './modules/meetings/meeting.routes';
import meetingParticipantRoutes from './modules/meeting-participants/meeting-participant.routes';
import taskRoutes from './modules/tasks/task.routes';
import taskActivityRoutes from './modules/task-activity/task-activity.routes';
import labelRoutes from './modules/labels/label.routes';
import notificationRoutes from './modules/notifications/notification.routes';



const app = express();
app.use(express.json());

// Rutas públicas
app.use('/auth', authRoutes);

// Rutas protegidas
app.use('/users', authMiddleware, userRoutes);
app.use('/meetings', authMiddleware, meetingRoutes);
app.use('/meetings/:meetingId/participants', authMiddleware, meetingParticipantRoutes);
app.use('/meetings/:meetingId/tasks', authMiddleware, taskRoutes);
app.use('/tasks/:taskId/activity', authMiddleware, taskActivityRoutes);
app.use('/labels', labelRoutes);
app.use('/notifications', notificationRoutes);


export default app;
