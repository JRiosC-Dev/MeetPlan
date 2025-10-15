// src/modules/tasks/task.controller.ts
import { Request, Response } from 'express';
import { TaskService } from './task.service';

const service = new TaskService();

export class TaskController {
  async create(req: Request, res: Response) {
    try {
      const { meetingId } = req.params;
      const user = (req as any).user;
      const task = await service.createTask(meetingId, {
        title: req.body.title,
        description: req.body.description,
        assigneeId: req.body.assigneeId,
        dueAt: req.body.dueAt ? new Date(req.body.dueAt) : undefined,
        priority: req.body.priority,
        createdBy: user.sub, // 👈 se usa para log de actividad
      });
      res.status(201).json(task);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    const { meetingId } = req.params;
    const tasks = await service.listTasks(meetingId);
    res.json(tasks);
  }

  async get(req: Request, res: Response) {
    const task = await service.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    res.json(task);
  }

  async update(req: Request, res: Response) {
    const user = (req as any).user;
    const task = await service.updateTask(req.params.id, req.body, user.sub); // 👈 pasamos actorId
    res.json(task);
  }

  async delete(req: Request, res: Response) {
    const user = (req as any).user;
    await service.deleteTask(req.params.id, user.sub); // 👈 pasamos actorId
    res.json({ message: 'Task deleted' });
  }
}
