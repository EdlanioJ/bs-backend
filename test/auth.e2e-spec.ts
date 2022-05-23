import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'bson';
import * as request from 'supertest';
import { AuthHelpers } from '../src/auth/helpers';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma';

jest.setTimeout(30000);

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authHelpers: AuthHelpers;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
    authHelpers = app.get(AuthHelpers);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    await app.close();
  });

  it('/auth/login/ (POST)', async () => {
    const password = faker.internet.password();
    const hashedPassword = await authHelpers.hashData(password);
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: hashedPassword,
        name: faker.name.findName(),
      },
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login/')
      .send({
        email: user.email,
        password,
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  it('/auth/register/ (POST)', async () => {
    const password = faker.internet.password();

    const response = await request(app.getHttpServer())
      .post('/auth/register/')
      .send({
        email: faker.internet.email(),
        password,
        confirmPassword: password,
        name: faker.name.findName(),
      });

    expect(response.status).toBe(HttpStatus.CREATED);
  });

  it('/auth/password/forgot/ (POST)', async () => {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.findName(),
      },
    });

    const response = await request(app.getHttpServer())
      .post('/auth/password/forgot/')
      .send({
        email: user.email,
      });

    expect(response.status).toBe(HttpStatus.NO_CONTENT);
  });

  it('/auth/password/reset/:token (POST)', async () => {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.findName(),
        resetPasswordToken: faker.datatype.uuid(),
        resetPasswordExpires: faker.date.future(),
      },
    });

    const password = faker.internet.password();
    const response = await request(app.getHttpServer())
      .post(`/auth/password/reset/${user.resetPasswordToken}`)
      .send({
        password,
        confirmPassword: password,
      });

    expect(response.status).toBe(HttpStatus.NO_CONTENT);
  });

  it('/auth/refresh/ (POST)', async () => {
    const id = new ObjectId().toHexString();
    const email = faker.internet.email();
    const role = 'USER';
    const tokens = await authHelpers.generateTokens(id, email, role);

    await prisma.user.create({
      data: {
        id,
        email,
        role,
        name: faker.name.findName(),
        refreshToken: await authHelpers.hashData(tokens.refreshToken),
      },
    });

    const response = await request(app.getHttpServer())
      .post('/auth/refresh/')
      .set('Authorization', `Bearer ${tokens.refreshToken}`);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });
});
