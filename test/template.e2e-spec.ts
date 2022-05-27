import { faker } from '@faker-js/faker';
import * as request from 'supertest';

import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AuthHelpers } from '../src/auth/helpers';
import { PrismaService } from '../src/prisma';

jest.setTimeout(30000);

describe('TemplateController', () => {
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
    await prisma.template.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/template/ (POST)', async () => {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
        role: 'ADMIN',
      },
    });

    const { accessToken } = await authHelpers.generateTokens(
      user.id,
      user.name,
      user.role,
    );
    const response = await request(app.getHttpServer())
      .post('/template')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        body: faker.lorem.paragraph(),
        type: 'EMAIL',
        subject: faker.lorem.sentence(),
      });

    expect(response.status).toBe(HttpStatus.CREATED);
  });

  it('/template/:id (GET)', async () => {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
        role: 'ADMIN',
      },
    });

    const template = await prisma.template.create({
      data: {
        body: faker.lorem.paragraph(),
        type: 'EMAIL',
        subject: faker.lorem.sentence(),
        user: { connect: { id: user.id } },
      },
    });

    const { accessToken } = await authHelpers.generateTokens(
      user.id,
      user.name,
      user.role,
    );

    const response = await request(app.getHttpServer())
      .get(`/template/${template.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.id).toBe(template.id);
  });

  it('/template/ (GET)', async () => {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
        role: 'ADMIN',
      },
    });

    await prisma.template.create({
      data: {
        body: faker.lorem.paragraph(),
        type: 'EMAIL',
        subject: faker.lorem.sentence(),
        user: { connect: { id: user.id } },
      },
    });

    const { accessToken } = await authHelpers.generateTokens(
      user.id,
      user.name,
      user.role,
    );

    const response = await request(app.getHttpServer())
      .get('/template/')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.length).toBe(1);
    expect(response.headers['x-total-count']).toBe('1');
  });
});
