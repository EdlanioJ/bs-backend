import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma';
import { ProviderConnectionRepository } from './provider-connection.repository';

describe('ProviderConnectionRepository', () => {
  let repository: ProviderConnectionRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProviderConnectionRepository, PrismaService],
    }).compile();

    repository = module.get<ProviderConnectionRepository>(
      ProviderConnectionRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
