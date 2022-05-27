import { faker } from '@faker-js/faker';
import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AuthHelpers } from '../src/auth/helpers';
import { PrismaService } from '../src/prisma';

jest.setTimeout(30000);

describe('ServiceProviderController', () => {
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
    await prisma.serviceProvider.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/provider/ (POST)', async () => {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
        role: 'MANAGER',
      },
    });

    const { accessToken } = await authHelpers.generateTokens(
      user.id,
      user.name,
      user.role,
    );

    const response = await request(app.getHttpServer())
      .post('/provider')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: faker.company.companyName(),
      });

    expect(response.status).toBe(HttpStatus.CREATED);
  });

  it('/provider/:id (GET)', async () => {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
        role: 'MANAGER',
      },
    });

    const { accessToken } = await authHelpers.generateTokens(
      user.id,
      user.name,
      user.role,
    );

    const provider = await prisma.serviceProvider.create({
      data: {
        name: faker.company.companyName(),
        user: { connect: { id: user.id } },
      },
    });

    const response = await request(app.getHttpServer())
      .get(`/provider/${provider.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.id).toBe(provider.id);
  });

  it('/provider/:id (DELETE)', async () => {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
        role: 'MANAGER',
      },
    });

    const provider = await prisma.serviceProvider.create({
      data: {
        name: faker.company.companyName(),
        user: { connect: { id: user.id } },
      },
    });

    const { accessToken } = await authHelpers.generateTokens(
      user.id,
      user.name,
      user.role,
    );

    const response = await request(app.getHttpServer())
      .delete(`/provider/${provider.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.NO_CONTENT);
  });
});
