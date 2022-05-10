import { Test } from '@nestjs/testing';
import { connectionRequestStub } from '../../../test/mocks/stubs';
import { PrismaService } from '../../prisma';
import { RequestConnectionRepository } from './request-connection.repository';

const requestConnection = connectionRequestStub();
const db = {
  providerConnectionRequest: {
    create: jest.fn().mockResolvedValue(requestConnection),
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
});
