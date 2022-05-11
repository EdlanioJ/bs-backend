import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma';
import { ManagerRepository } from './manager.repository';

const db = {
  manager: {
    create: jest.fn().mockResolvedValue(null),
  },
};

describe('ManagerRepository', () => {
  let repository: ManagerRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ManagerRepository, { provide: PrismaService, useValue: db }],
    }).compile();
    repository = module.get<ManagerRepository>(ManagerRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create a manager', async () => {
    const spy = jest.spyOn(prisma.manager, 'create');
    const result = await repository.create({
      authorizedBy: { connect: { id: 'any_admin_id' } },
      user: { connect: { id: 'any_user_id' } },
    });
    expect(result).toEqual(null);
    expect(spy).toHaveBeenCalledWith({
      data: {
        authorizedBy: { connect: { id: 'any_admin_id' } },
        user: { connect: { id: 'any_user_id' } },
      },
    });
  });
});
