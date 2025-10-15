// src/modules/task-activity/task-activity.controller.ts
import { Request, Response } from 'express';
import { TaskActivityService } from './task-activity.service';

const service = new TaskActivityService();

export class TaskActivityController {
  async list(req: Request, res: Response) {
    const { taskId } = req.params;
    const activities = await service.listByTask(taskId);
    res.json(activities);
  }
}
