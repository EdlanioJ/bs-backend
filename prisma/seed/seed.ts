import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'bson';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import templates from './templates';
import { addMinutes, addDays } from 'date-fns';

const prisma = new PrismaClient();

type User = {
  id: string;
  email: string;
  password: string;
  role: string;
};

type ManageRequest = {
  id: string;
  userId: string;
  status: string;
};

type ProviderService = {
  id: string;
  name: string;
  userId: string;
};

type Service = {
  id: string;
  name: string;
  providerId: string;
  appointmentDurationInMinutes: number;
};

type Appointment = {
  id: string;
  serviceId: string;
  providerId: string;
  employeeId: string;
  userId: string;
};

async function main() {
  dotenv.config();

  const password = 'admin123456';
  const hashedPassword = bcrypt.hashSync(password, 12);
  const user = await prisma.user.create({
    data: {
      name: 'admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'ADMIN',
      avatar: 'https://github.com/EdlanioJ.png',
      createdAt: faker.date.past(7),
    },
  });

  const admin: User = {
    id: user.id,
    email: user.email,
    role: user.role,
    password,
  };

  const users: User[] = [];
  const managers: User[] = [];
  const employees: User[] = [];
  const requests: ManageRequest[] = [];
  const providers: ProviderService[] = [];
  const services: Service[] = [];
  const appointments: Appointment[] = [];

  for (let i = 0; i < 50; i++) {
    const password = faker.internet.password();
    const hashedPassword = bcrypt.hashSync(password, 12);

    const user = await prisma.user.create({
      data: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: hashedPassword,
        role: 'USER',
        avatar: faker.image.avatar(),
        createdAt: faker.date.past(6),
      },
    });

    users.push({ email: user.email, id: user.id, role: user.role, password });
  }

  for (let i = 0; i < 10; i++) {
    const password = faker.internet.password();
    const hashedPassword = bcrypt.hashSync(password, 12);

    const user = await prisma.user.create({
      data: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: hashedPassword,
        role: 'MANAGER',
        avatar: faker.image.avatar(),
        createdAt: faker.date.past(6),
      },
    });

    managers.push({
      email: user.email,
      id: user.id,
      role: user.role,
      password,
    });
  }

  for (let i = 0; i < 10; i++) {
    const password = faker.internet.password();
    const userId = new ObjectId().toString();
    const email = faker.internet.email();

    const hashedPassword = bcrypt.hashSync(password, 12);
    const managerRequest = await prisma.managerRequest.create({
      data: {
        user: {
          create: {
            id: userId,
            name: faker.name.findName(),
            email,
            password: hashedPassword,
            role: 'USER',
            avatar: faker.image.avatar(),
            createdAt: faker.date.past(6),
          },
        },
        status: 'REJECTED',
        rejectBy: { connect: { id: admin.id } },
        rejectReason: faker.lorem.paragraph(),
        createdAt: faker.date.past(5),
      },
    });

    users.push({ email, password, role: 'USER', id: userId });
    requests.push({
      id: managerRequest.id,
      userId: managerRequest.userId,
      status: managerRequest.status,
    });
  }

  for (const user of managers) {
    if (user.role === 'MANAGER') {
      const request = await prisma.managerRequest.create({
        data: {
          user: { connect: { id: user.id } },
          status: 'ACCEPTED',
          createdAt: faker.date.past(5),
        },
      });

      await prisma.manager.create({
        data: {
          user: { connect: { id: user.id } },
          authorizedBy: { connect: { id: admin.id } },
          createdAt: faker.date.past(4),
        },
      });

      const provider = await prisma.serviceProvider.create({
        data: {
          user: { connect: { id: user.id } },
          createdAt: faker.date.past(3),
          name: faker.company.companyName(),
        },
      });

      providers.push({
        id: provider.id,
        name: provider.name,
        userId: user.id,
      });
      requests.push({
        id: request.id,
        status: request.status,
        userId: user.id,
      });
    }
  }

  for (const provider of providers) {
    for (let i = 0; i < Math.floor(Math.random() * 10) + 1; i++) {
      const service = await prisma.service.create({
        data: {
          provider: { connect: { id: provider.id } },
          name: faker.commerce.productName(),
          appointmentDurationInMinutes: faker.datatype.number({
            min: 30,
            max: 60,
            precision: 1,
          }),
          createdAt: faker.date.past(2),
        },
      });

      services.push({
        id: service.id,
        name: service.name,
        providerId: provider.id,
        appointmentDurationInMinutes: service.appointmentDurationInMinutes,
      });
    }

    for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
      const password = faker.internet.password();
      const hashedPassword = bcrypt.hashSync(password, 12);

      const employee = await prisma.user.create({
        data: {
          name: faker.name.findName(),
          email: faker.internet.email(),
          avatar: faker.image.avatar(),
          password: hashedPassword,
          createdAt: faker.date.past(6),
          role: 'EMPLOYEE',
        },
      });

      await prisma.providerConnection.create({
        data: {
          user: { connect: { id: employee.id } },
          provider: { connect: { id: provider.id } },
          createdAt: faker.date.past(2),
        },
      });

      await prisma.providerConnectionRequest.create({
        data: {
          employee: { connect: { id: employee.id } },
          provider: { connect: { id: provider.id } },
          status: 'ACCEPTED',
          createdAt: faker.date.past(3),
        },
      });

      employees.push({
        email: employee.email,
        id: employee.id,
        role: employee.role,
        password,
      });
    }
  }

  for (const user of users) {
    for (let i = 0; i < Math.floor(Math.random() * 10) + 1; i++) {
      const service = faker.random.arrayElement(services);
      const employee = faker.random.arrayElement(employees);
      const createdAt = faker.date.past(1);
      const startTime = addDays(createdAt, 1);

      const appointment = await prisma.appointment.create({
        data: {
          customer: { connect: { id: user.id } },
          service: { connect: { id: service.id } },
          employee: { connect: { id: employee.id } },
          status: 'COMPLETED',
          start: startTime,
          end: addMinutes(startTime, service.appointmentDurationInMinutes),
          createdAt,
        },
      });

      appointments.push({
        id: appointment.id,
        userId: user.id,
        providerId: service.providerId,
        employeeId: appointment.employeeId,
        serviceId: service.id,
      });
    }
  }

  for (const user of users) {
    for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
      const service = faker.random.arrayElement(services);
      const employee = faker.random.arrayElement(employees);
      const createdAt = faker.date.past(1);
      const startTime = faker.date.future();

      const appointment = await prisma.appointment.create({
        data: {
          customer: { connect: { id: user.id } },
          service: { connect: { id: service.id } },
          employee: { connect: { id: employee.id } },
          status: 'PENDING',
          start: startTime,
          end: addMinutes(startTime, service.appointmentDurationInMinutes),
          createdAt,
        },
      });

      appointments.push({
        id: appointment.id,
        userId: user.id,
        employeeId: appointment.employeeId,
        providerId: service.providerId,
        serviceId: service.id,
      });
    }
  }

  for (const template of templates) {
    await prisma.template.create({
      data: {
        body: template.body,
        subject: template.subject,
        type: template.type,
        user: { connect: { id: admin.id } },
      },
    });
  }

  const data = {
    admin,
    users,
    managers,
    employees,
    requests,
    providers,
    services,
    appointments,
  };

  const filename = `prisma/seed/seed-${Date.now()}.json`;
  fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
