// src/modules/tasks/task.routes.ts
import { Router } from 'express';
import { TaskController } from './task.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router({ mergeParams: true });
const controller = new TaskController();

// POST /meetings/:meetingId/tasks
router.post('/', authMiddleware, (req, res) => controller.create(req, res));

// GET /meetings/:meetingId/tasks
router.get('/', authMiddleware, (req, res) => controller.list(req, res));

// GET /tasks/:id
router.get('/:id', authMiddleware, (req, res) => controller.get(req, res));

// PUT /tasks/:id
router.put('/:id', authMiddleware, (req, res) => controller.update(req, res));

// DELETE /tasks/:id
router.delete('/:id', authMiddleware, (req, res) => controller.delete(req, res));

export default router;
