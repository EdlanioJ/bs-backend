import { faker } from '@faker-js/faker';
import * as request from 'supertest';

import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AuthHelpers } from '../src/auth/helpers';
import { PrismaService } from '../src/prisma';

jest.setTimeout(30000);

describe('UserManagerController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authHelpers: AuthHelpers;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
    authHelpers = app.get(AuthHelpers);
  });

  afterEach(async () => {
    await prisma.manager.deleteMany({});
    await prisma.managerRequest.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/user/manager/request/ (POST)', async () => {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
        role: 'USER',
      },
    });

    const { accessToken } = await authHelpers.generateTokens(
      user.id,
      user.name,
      user.role,
    );

    const response = await request(app.getHttpServer())
      .post('/user/manager/request')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.CREATED);
  });

  it('/user/manager/request/accept/:id (POST)', async () => {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
        role: 'USER',
      },
    });

    const managerRequest = await prisma.managerRequest.create({
      data: {
        user: { connect: { id: user.id } },
        status: 'PENDING',
      },
    });

    const admin = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
        role: 'ADMIN',
      },
    });

    const { accessToken } = await authHelpers.generateTokens(
      admin.id,
      admin.name,
      admin.role,
    );

    const response = await request(app.getHttpServer())
      .post(`/user/manager/request/accept/${managerRequest.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.CREATED);
  });

  it('/user/manager/request/reject/:id (POST)', async () => {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
        role: 'USER',
      },
    });

    const managerRequest = await prisma.managerRequest.create({
      data: {
        user: { connect: { id: user.id } },
        status: 'PENDING',
      },
    });

    const admin = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
        role: 'ADMIN',
      },
    });

    const { accessToken } = await authHelpers.generateTokens(
      admin.id,
      admin.name,
      admin.role,
    );

    const response = await request(app.getHttpServer())
      .post(`/user/manager/request/reject/${managerRequest.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        reason: 'I do not like you',
      });

    expect(response.status).toBe(HttpStatus.NO_CONTENT);
  });

  it('/user/manager/request/ (GET)', async () => {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
        role: 'USER',
      },
    });

    const managerRequest = await prisma.managerRequest.create({
      data: {
        user: { connect: { id: user.id } },
        status: 'PENDING',
      },
    });

    const admin = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
        role: 'ADMIN',
      },
    });
    const { accessToken } = await authHelpers.generateTokens(
      admin.id,
      admin.name,
      admin.role,
    );

    const response = await request(app.getHttpServer())
      .get('/user/manager/request')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.managerRequests.length).toBe(1);
    expect(response.body.managerRequests[0].id).toBe(managerRequest.id);
    expect(response.body.total).toBe(1);
  });
});
