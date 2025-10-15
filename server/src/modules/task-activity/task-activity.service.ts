// src/modules/task-activity/task-activity.service.ts
import { prisma } from '../../lib/prisma';

export class TaskActivityService {
  async logActivity(taskId: string, actorId: string | null, action: string, details?: any) {
    return prisma.task_activity.create({
      data: {
        task_id: taskId,
        actor_id: actorId,
        action,
        details,
      },
    });
  }

  async listByTask(taskId: string) {
    return prisma.task_activity.findMany({
      where: { task_id: taskId },
      orderBy: { created_at: 'desc' },
      include: { users: true },
    });
  }
}
