import express from 'express';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import { authMiddleware } from './middlewares/auth.middleware';

const app = express();
app.use(express.json());

// Rutas públicas
app.use('/auth', authRoutes);

// Rutas protegidas
app.use('/users', authMiddleware, userRoutes);
// más adelante: app.use('/meetings', authMiddleware, meetingRoutes);
// más adelante: app.use('/tasks', authMiddleware, taskRoutes);

export default app;
