import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const service = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, fullName } = req.body;
      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Faltan campos' });
      }
      const result = await service.register({ email, password, fullName });
      return res.status(201).json(result);
    } catch (e: any) {
      const msg = e?.message ?? 'Error inesperado';
      const status = msg.includes('registrado') ? 409 : 500;
      return res.status(status).json({ error: msg });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Faltan credenciales' });
      }
      const result = await service.login({ email, password });
      return res.status(200).json(result);
    } catch (e: any) {
      const msg = e?.message ?? 'Error inesperado';
      const status = msg.includes('Credenciales inválidas') ? 401 : 500;
      return res.status(status).json({ error: msg });
    }
  }
}
