import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma';
import { ManagerRepository } from './manager.repository';

describe('ManagerRepository', () => {
  let repository: ManagerRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ManagerRepository, PrismaService],
    }).compile();
    repository = module.get<ManagerRepository>(ManagerRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
