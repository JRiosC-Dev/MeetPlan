// src/modules/meeting-participants/meeting-participant.routes.ts
import { Router } from 'express';
import { MeetingParticipantController } from './meeting-participant.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router({ mergeParams: true });
const controller = new MeetingParticipantController();

// POST /meetings/:meetingId/participants
router.post('/', authMiddleware, (req, res) => controller.add(req, res));

// GET /meetings/:meetingId/participants
router.get('/', authMiddleware, (req, res) => controller.list(req, res));

// PUT /meetings/:meetingId/participants/:userId
router.put('/:userId', authMiddleware, (req, res) => controller.update(req, res));

// DELETE /meetings/:meetingId/participants/:userId
router.delete('/:userId', authMiddleware, (req, res) => controller.remove(req, res));

export default router;
