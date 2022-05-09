import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma';
import { ServiceRepository } from './service.repository';

describe('ServiceRepository', () => {
  let repository: ServiceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServiceRepository, PrismaService],
    }).compile();
    repository = module.get<ServiceRepository>(ServiceRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
