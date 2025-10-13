// src/modules/users/user.controller.ts
import { Request, Response } from 'express';
import { UserService } from './user.service';

const service = new UserService();

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const user = await service.createUser(req.body);
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: 'Error creating user', details: err });
    }
  }

  async list(req: Request, res: Response) {
    const users = await service.getUsers();
    res.json(users);
  }

  async get(req: Request, res: Response) {
    const user = await service.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  }

  async update(req: Request, res: Response) {
    const user = await service.updateUser(req.params.id, req.body);
    res.json(user);
  }

  async delete(req: Request, res: Response) {
    await service.deleteUser(req.params.id);
    res.json({ message: 'User deleted' });
  }
}
