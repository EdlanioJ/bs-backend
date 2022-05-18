import { faker } from '@faker-js/faker';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma';

jest.setTimeout(30000);

describe('AppointmentController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
    configService = app.get(ConfigService);
  });

  afterAll(async () => {
    await prisma.appointment.deleteMany();
    await prisma.service.deleteMany();
    await prisma.serviceProvider.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    await app.close();
  });

  it('/appointment/ (POST)', async () => {
    const manager = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.findName(),
        role: 'MANAGER',
      },
    });
    const provider = await prisma.serviceProvider.create({
      data: {
        name: faker.company.companyName(),
        user: { connect: { id: manager.id } },
      },
    });

    const service = await prisma.service.create({
      data: {
        name: 'My Service',
        appointmentDurationInMinutes: 30,
        provider: { connect: { id: provider.id } },
      },
    });

    const employee = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.findName(),
        role: 'EMPLOYEE',
      },
    });

    const customer = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.findName(),
      },
    });

    const token = jwt.sign(
      { sub: customer.id, role: customer.role, email: customer.email },
      configService.get('JWT_SECRET'),
      { expiresIn: '15m' },
    );

    const startAt = faker.date.future();
    const response = await request(app.getHttpServer())
      .post('/appointment/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        serviceId: service.id,
        employeeId: employee.id,
        startAt,
      });

    expect(response.status).toBe(201);
  });
});
