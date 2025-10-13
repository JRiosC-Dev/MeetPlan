import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  const adminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.users.create({
    data: {
      email: 'admin@meetplan.io',
      password_hash: adminPassword,
      full_name: 'Administrador MeetPlan',
      role: 'admin',
    },
  });

  console.log('✅ Admin insertado:', admin);

  const userPassword = await bcrypt.hash('user123', 10);

  const user = await prisma.users.create({
    data: {
      email: 'user@meetplan.io',
      password_hash: userPassword,
      full_name: 'Usuario de Prueba',
      role: 'user',
    },
  });

  console.log('✅ Usuario insertado:', user);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Error en seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
