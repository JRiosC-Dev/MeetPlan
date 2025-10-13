// src/modules/meetings/meeting.routes.ts
import { Router } from 'express';
import { MeetingController } from './meeting.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();
const controller = new MeetingController();

router.post('/', authMiddleware, (req, res) => controller.create(req, res));
router.get('/', authMiddleware, (req, res) => controller.list(req, res));
router.get('/:id', authMiddleware, (req, res) => controller.get(req, res));
router.put('/:id', authMiddleware, (req, res) => controller.update(req, res));
router.delete('/:id', authMiddleware, (req, res) => controller.delete(req, res));

export default router;
