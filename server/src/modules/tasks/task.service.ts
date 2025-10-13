// src/modules/tasks/task.service.ts
import { prisma } from '../../lib/prisma';

export class TaskService {
  async createTask(meetingId: string, data: {
    title: string;
    description?: string;
    assigneeId?: string;
    dueAt?: Date;
    priority?: string;
    createdBy: string;
  }) {
    return prisma.tasks.create({
      data: {
        meeting_id: meetingId,
        title: data.title,
        description: data.description,
        assignee_id: data.assigneeId,
        due_at: data.dueAt,
        priority: data.priority as any,
        created_by: data.createdBy,
      },
    });
  }

  async listTasks(meetingId: string) {
    return prisma.tasks.findMany({
      where: { meeting_id: meetingId },
      include: {
        users_tasks_assignee_idTousers: true,
        users_tasks_created_byTousers: true,
      },
    });
  }

  async getTaskById(id: string) {
    return prisma.tasks.findUnique({
      where: { id },
      include: {
        users_tasks_assignee_idTousers: true,
        users_tasks_created_byTousers: true,
      },
    });
  }

  async updateTask(id: string, data: Partial<{
    title: string;
    description: string;
    status: string;
    priority: string;
    dueAt: Date;
    assigneeId: string;
  }>) {
    return prisma.tasks.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status as any,
        priority: data.priority as any,
        due_at: data.dueAt,
        assignee_id: data.assigneeId,
      },
    });
  }

  async deleteTask(id: string) {
    return prisma.tasks.delete({ where: { id } });
  }
}
