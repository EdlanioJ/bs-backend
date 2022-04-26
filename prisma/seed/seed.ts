import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

import templates from './templates';

const prisma = new PrismaClient();

async function main() {
  dotenv.config();

  const hashedPassword = await bcrypt.hash('admin123456', 12);
  const user = await prisma.user.create({
    data: {
      name: 'admin',
      email: 'admin@bs.com',
      password: hashedPassword,
      role: 'ADMIN',
      avatar: 'https://github.com/EdlanioJ.png',
    },
  });

  for (const template of templates) {
    await prisma.template.create({
      data: {
        body: template.body,
        subject: template.subject,
        type: template.type,
        user: { connect: { id: user.id } },
      },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
