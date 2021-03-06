import { Test } from '@nestjs/testing';
import { managerRequestStub } from '../../../test/stubs';
import { PrismaService } from '../../prisma';
import { ManagerRequestRepository } from './manager-request.repository';

const managerRequest = managerRequestStub();

const db = {
  managerRequest: {
    create: jest.fn().mockResolvedValue(managerRequest),
    update: jest.fn().mockResolvedValue(managerRequest),
    count: jest.fn().mockResolvedValue(1),
    findMany: jest.fn().mockResolvedValue([managerRequest]),
    findFirst: jest.fn().mockResolvedValue(managerRequest),
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

  it('should update a manager request', async () => {
    const spy = jest.spyOn(prisma.managerRequest, 'update');
    const result = await repository.update('any_id', {
      status: 'ACCEPTED',
    });
    expect(result).toEqual(managerRequest);
    expect(spy).toHaveBeenCalledWith({
      where: { id: 'any_id' },
      data: { status: 'ACCEPTED' },
    });
  });

  it('should count manager requests', async () => {
    const spy = jest.spyOn(prisma.managerRequest, 'count');
    const result = await repository.count({
      where: {
        status: 'PENDING',
      },
    });
    expect(result).toEqual(1);
    expect(spy).toHaveBeenCalledWith({
      where: {
        status: 'PENDING',
      },
    });
  });

  it('should find all manager requests', async () => {
    const spy = jest.spyOn(prisma.managerRequest, 'findMany');
    const result = await repository.findAll({
      where: {
        status: 'PENDING',
      },
    });
    expect(result).toEqual([managerRequest]);
    expect(spy).toHaveBeenCalledWith({
      where: {
        status: 'PENDING',
      },
    });
  });

  it('should find an available manager request', async () => {
    const spy = jest.spyOn(prisma.managerRequest, 'findFirst');
    const result = await repository.findAvailable('any_request_id');
    expect(result).toEqual(managerRequest);
    expect(spy).toHaveBeenCalledWith({
      where: {
        id: 'any_request_id',
        status: 'PENDING',
      },
    });
  });

  it('should find one manager request', async () => {
    const spy = jest.spyOn(prisma.managerRequest, 'findFirst');
    const result = await repository.findOne('any_user_id');
    expect(result).toEqual(managerRequest);
    expect(spy).toHaveBeenCalledWith({
      where: {
        id: 'any_user_id',
      },
    });
  });
});
