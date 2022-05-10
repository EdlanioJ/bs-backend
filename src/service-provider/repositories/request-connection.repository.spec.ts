import { Test } from '@nestjs/testing';
import { connectionRequestStub } from '../../../test/mocks/stubs';
import { PrismaService } from '../../prisma';
import { RequestConnectionRepository } from './request-connection.repository';

const requestConnection = connectionRequestStub();
const db = {
  providerConnectionRequest: {
    create: jest.fn().mockResolvedValue(requestConnection),
    update: jest.fn().mockResolvedValue(requestConnection),
    findFirst: jest.fn().mockResolvedValue(requestConnection),
    delete: jest.fn().mockResolvedValue(requestConnection),
  },
};
describe('RequestConnectionRepository', () => {
  let repository: RequestConnectionRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RequestConnectionRepository,
        { provide: PrismaService, useValue: db },
      ],
    }).compile();

    repository = module.get<RequestConnectionRepository>(
      RequestConnectionRepository,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create request connection', async () => {
    const spy = jest.spyOn(prisma.providerConnectionRequest, 'create');
    const result = await repository.create({
      provider: { connect: { id: 'providerId' } },
      employee: { connect: { id: 'employeeId' } },
      status: 'PENDING',
    });
    expect(result).toBe(requestConnection);
    expect(spy).toHaveBeenCalledWith({
      data: {
        provider: { connect: { id: 'providerId' } },
        employee: { connect: { id: 'employeeId' } },
        status: 'PENDING',
      },
    });
  });

  it('should update request connection', async () => {
    const spy = jest.spyOn(prisma.providerConnectionRequest, 'update');
    const result = await repository.update('requestId', {
      status: 'ACCEPTED',
    });
    expect(result).toBe(requestConnection);
    expect(spy).toHaveBeenCalledWith({
      where: { id: 'requestId' },
      data: {
        status: 'ACCEPTED',
      },
    });
  });

  it('should find one request connection', async () => {
    const spy = jest.spyOn(prisma.providerConnectionRequest, 'findFirst');
    const result = await repository.findOne('requestId');
    expect(result).toBe(requestConnection);
    expect(spy).toHaveBeenCalledWith({
      where: { id: 'requestId' },
    });
  });

  it('should delete request connection', async () => {
    const spy = jest.spyOn(prisma.providerConnectionRequest, 'delete');
    const result = await repository.delete('requestId');
    expect(result).toBe(requestConnection);
    expect(spy).toHaveBeenCalledWith({
      where: { id: 'requestId' },
    });
  });

  it('should find available request connection', async () => {
    const spy = jest.spyOn(prisma.providerConnectionRequest, 'findFirst');
    const result = await repository.findAvailable('providerId', 'employeeId');
    expect(result).toBe(requestConnection);
    expect(spy).toHaveBeenCalledWith({
      where: {
        provider: { id: 'providerId' },
        employee: { id: 'employeeId' },
        status: {
          in: ['PENDING', 'ACCEPTED'],
        },
      },
    });
  });
});
