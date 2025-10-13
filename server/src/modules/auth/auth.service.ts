import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

type RegisterInput = { email: string; password: string; fullName: string };
type LoginInput = { email: string; password: string };

export class AuthService {
  async register({ email, password, fullName }: RegisterInput) {
    const exists = await prisma.users.findUnique({ where: { email } });
    if (exists) throw new Error('Email ya registrado');

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        email,
        password_hash: hash,
        full_name: fullName,
        role: 'user',
        is_active: true,
        timezone: 'UTC',
      },
    });

    return { id: user.id, email: user.email, full_name: user.full_name, role: user.role };
  }

  async login({ email, password }: LoginInput) {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) throw new Error('Credenciales inválidas');

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new Error('Credenciales inválidas');

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }
}
