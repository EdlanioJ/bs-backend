import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma';
import { ManagerRequestRepository } from './manager-request.repository';

describe('ManagerRequestRepository', () => {
  let repository: ManagerRequestRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ManagerRequestRepository, PrismaService],
    }).compile();
    repository = module.get<ManagerRequestRepository>(ManagerRequestRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
