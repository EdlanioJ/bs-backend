import faker from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthHelpers } from '../src/auth/helpers';
import { PrismaService } from '../src/prisma';

jest.setTimeout(30000);

describe('ConnectionProviderController (e2e)', () => {
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
    await prisma.providerConnectionRequest.deleteMany();
    await prisma.serviceProvider.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/provider/connection/require/:userId (POST)', async () => {
    const manager = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        role: 'MANAGER',
        name: faker.name.findName(),
      },
    });

    await prisma.serviceProvider.create({
      data: {
        name: faker.company.companyName(),
        user: { connect: { id: manager.id } },
      },
    });

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
      },
    });

    const { accessToken } = await authHelpers.generateTokens(
      manager.id,
      manager.name,
      manager.role,
    );

    const response = await request(app.getHttpServer())
      .post(`/provider/connection/require/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.CREATED);
  });

  it('/provider/connection/accept/:id', async () => {
    const manager = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        role: 'MANAGER',
        name: faker.name.findName(),
      },
    });

    const provider = await prisma.serviceProvider.create({
      data: {
        name: faker.company.companyName(),
        user: { connect: { id: manager.id } },
      },
    });

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
      },
    });

    const connectionRequest = await prisma.providerConnectionRequest.create({
      data: {
        employee: { connect: { id: user.id } },
        provider: { connect: { id: provider.id } },
        status: 'PENDING',
      },
    });

    const { accessToken } = await authHelpers.generateTokens(
      user.id,
      user.name,
      user.role,
    );

    const response = await request(app.getHttpServer())
      .post(`/provider/connection/accept/${connectionRequest.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    await prisma.providerConnection.deleteMany();
    expect(response.status).toBe(HttpStatus.CREATED);
  });

  it('/provider/connection/reject/:id', async () => {
    const manager = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        role: 'MANAGER',
        name: faker.name.findName(),
      },
    });

    const provider = await prisma.serviceProvider.create({
      data: {
        name: faker.company.companyName(),
        user: { connect: { id: manager.id } },
      },
    });

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
      },
    });

    const connectionRequest = await prisma.providerConnectionRequest.create({
      data: {
        employee: { connect: { id: user.id } },
        provider: { connect: { id: provider.id } },
        status: 'PENDING',
      },
    });

    const { accessToken } = await authHelpers.generateTokens(
      user.id,
      user.name,
      user.role,
    );

    const response = await request(app.getHttpServer())
      .patch(`/provider/connection/reject/${connectionRequest.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.NO_CONTENT);
  });

  it('/provider/connection/:id (DELETE)', async () => {
    const manager = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        role: 'MANAGER',
        name: faker.name.findName(),
      },
    });

    const provider = await prisma.serviceProvider.create({
      data: {
        name: faker.company.companyName(),
        user: { connect: { id: manager.id } },
      },
    });

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
      },
    });

    await prisma.providerConnectionRequest.create({
      data: {
        employee: { connect: { id: user.id } },
        provider: { connect: { id: provider.id } },
        status: 'ACCEPTED',
      },
    });

    const connection = await prisma.providerConnection.create({
      data: {
        provider: { connect: { id: provider.id } },
        user: { connect: { id: user.id } },
      },
    });

    const { accessToken } = await authHelpers.generateTokens(
      manager.id,
      manager.name,
      manager.role,
    );

    const response = await request(app.getHttpServer())
      .delete(`/provider/connection/${connection.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.NO_CONTENT);
  });
});
