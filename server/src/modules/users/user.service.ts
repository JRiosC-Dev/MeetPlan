import { prisma } from '../../lib/prisma';

export class UserService {
  async createUser(data: {
    email: string;
    password_hash: string;
    full_name: string;
    role: 'user' | 'admin';
  }) {
    return prisma.users.create({ data });
  }

  async getUsers() {
    return prisma.users.findMany();
  }

  async getUserById(id: string) {
    return prisma.users.findUnique({ where: { id } });
  }

  async updateUser(id: string, data: Partial<{ full_name: string; is_active: boolean }>) {
    return prisma.users.update({ where: { id }, data });
  }

  async deleteUser(id: string) {
    return prisma.users.delete({ where: { id } });
  }
}
