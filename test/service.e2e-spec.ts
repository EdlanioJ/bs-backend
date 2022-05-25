import { faker } from '@faker-js/faker';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthHelpers } from '../src/auth/helpers';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma';

jest.setTimeout(30000);

describe('ServiceController (e2e)', () => {
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
    await prisma.service.deleteMany();
    await prisma.serviceProvider.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/service/ (POST)', async () => {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        role: 'MANAGER',
        name: faker.name.findName(),
      },
    });
    await prisma.serviceProvider.create({
      data: {
        name: faker.company.companyName(),
        user: { connect: { id: user.id } },
      },
    });
    const { accessToken } = await authHelpers.generateTokens(
      user.id,
      user.email,
      user.role,
    );

    const response = await request(app.getHttpServer())
      .post('/service/')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: faker.company.companyName(),
        appointmentDurationInMinutes: 40,
      });

    expect(response.status).toBe(HttpStatus.CREATED);
  });
});
