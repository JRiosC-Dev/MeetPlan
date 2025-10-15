// src/modules/task-activity/task-activity.routes.ts
import { Router } from 'express';
import { TaskActivityController } from './task-activity.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router({ mergeParams: true });
const controller = new TaskActivityController();

// GET /tasks/:taskId/activity
router.get('/', authMiddleware, (req, res) => controller.list(req, res));

export default router;
