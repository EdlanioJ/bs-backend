import { faker } from '@faker-js/faker';
import { addDays, addMinutes, subMinutes } from 'date-fns';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma';
import { jwtSign } from './utils';

jest.setTimeout(30000);

describe('AppointmentController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
    configService = app.get(ConfigService);
  });

  afterEach(async () => {
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

    const token = jwtSign(
      { sub: customer.id, role: customer.role, email: customer.email },
      configService.get('JWT_SECRET'),
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

  it('/appointment/:id (GET)', async () => {
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

    const startAt = faker.date.future();
    const appointment = await prisma.appointment.create({
      data: {
        service: { connect: { id: service.id } },
        employee: { connect: { id: employee.id } },
        customer: { connect: { id: customer.id } },
        start: startAt,
        end: addMinutes(startAt, service.appointmentDurationInMinutes),
      },
    });

    const token = jwtSign(
      { sub: customer.id, role: customer.role, email: customer.email },
      configService.get('JWT_SECRET'),
    );

    const response = await request(app.getHttpServer())
      .get(`/appointment/${appointment.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(appointment.id);
  });

  it('/appointment/ (GET)', async () => {
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

    const startAt = faker.date.future();
    const appointment = await prisma.appointment.create({
      data: {
        service: { connect: { id: service.id } },
        employee: { connect: { id: employee.id } },
        customer: { connect: { id: customer.id } },
        start: startAt,
        end: addMinutes(startAt, service.appointmentDurationInMinutes),
      },
    });

    const token = jwtSign(
      { sub: customer.id, role: customer.role, email: customer.email },
      configService.get('JWT_SECRET'),
    );

    const response = await request(app.getHttpServer())
      .get('/appointment/')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].id).toBe(appointment.id);
    expect(response.headers['x-total-count']).toBe('1');
  });

  it('/appointment/employee/:id (GET)', async () => {
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

    const startAt = addDays(new Date(), 4);
    const appointment = await prisma.appointment.create({
      data: {
        service: { connect: { id: service.id } },
        employee: { connect: { id: employee.id } },
        customer: { connect: { id: customer.id } },
        start: startAt,
        end: addMinutes(startAt, service.appointmentDurationInMinutes),
      },
    });

    const token = jwtSign(
      { sub: customer.id, role: customer.role, email: customer.email },
      configService.get('JWT_SECRET'),
    );

    const response = await request(app.getHttpServer())
      .get(`/appointment/employee/${employee.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].id).toBe(appointment.id);
    expect(response.headers['x-total-count']).toBe('1');
  });

  it('/appointment/me/list (GET)', async () => {
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

    const startAt = addDays(new Date(), 4);
    const appointment = await prisma.appointment.create({
      data: {
        service: { connect: { id: service.id } },
        employee: { connect: { id: employee.id } },
        customer: { connect: { id: customer.id } },
        start: startAt,
        end: addMinutes(startAt, service.appointmentDurationInMinutes),
      },
    });

    const token = jwtSign(
      { sub: customer.id, role: customer.role, email: customer.email },
      configService.get('JWT_SECRET'),
    );

    const response = await request(app.getHttpServer())
      .get('/appointment/me/list')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].id).toBe(appointment.id);
    expect(response.headers['x-total-count']).toBe('1');
  });

  it('/appointment/cancel/:id (PATCH)', async () => {
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

    const startAt = addDays(new Date(), 4);
    const appointment = await prisma.appointment.create({
      data: {
        service: { connect: { id: service.id } },
        employee: { connect: { id: employee.id } },
        customer: { connect: { id: customer.id } },
        start: startAt,
        end: addMinutes(startAt, service.appointmentDurationInMinutes),
      },
    });

    const token = jwtSign(
      { sub: customer.id, role: customer.role, email: customer.email },
      configService.get('JWT_SECRET'),
    );

    const response = await request(app.getHttpServer())
      .patch(`/appointment/cancel/${appointment.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it('/appointment/complete/:id (PATCH)', async () => {
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

    const startAt = subMinutes(new Date(), 10);
    const appointment = await prisma.appointment.create({
      data: {
        service: { connect: { id: service.id } },
        employee: { connect: { id: employee.id } },
        customer: { connect: { id: customer.id } },
        start: startAt,
        end: addMinutes(startAt, service.appointmentDurationInMinutes),
      },
    });

    const token = jwtSign(
      { sub: employee.id, role: employee.role, email: employee.email },
      configService.get('JWT_SECRET'),
    );

    const response = await request(app.getHttpServer())
      .patch(`/appointment/complete/${appointment.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(204);
  });
});