import { Test } from '@nestjs/testing';
import { managerRequestStub } from '../../../test/mocks/stubs';
import { PrismaService } from '../../prisma';
import { ManagerRequestRepository } from './manager-request.repository';

const managerRequest = managerRequestStub();

const db = {
  managerRequest: {
    create: jest.fn().mockResolvedValue(managerRequest),
  },
};

describe('ManagerRequestRepository', () => {
  let repository: ManagerRequestRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ManagerRequestRepository,
        { provide: PrismaService, useValue: db },
      ],
    }).compile();
    repository = module.get<ManagerRequestRepository>(ManagerRequestRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create a manager request', async () => {
    const spy = jest.spyOn(prisma.managerRequest, 'create');
    const result = await repository.create({
      user: { connect: { id: 'any_user_id' } },
      status: 'PENDING',
    });
    expect(result).toEqual(managerRequest);
    expect(spy).toHaveBeenCalledWith({
      data: {
        user: { connect: { id: 'any_user_id' } },
        status: 'PENDING',
      },
    });
  });
});
