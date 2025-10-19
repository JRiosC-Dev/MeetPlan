import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();
const controller = new NotificationController();

router.post('/', authMiddleware, (req, res) => controller.create(req, res));
router.get('/', authMiddleware, (req, res) => controller.list(req, res));
router.put('/:id/sent', authMiddleware, (req, res) => controller.markSent(req, res));
router.put('/:id/cancel', authMiddleware, (req, res) => controller.cancel(req, res));

export default router;
