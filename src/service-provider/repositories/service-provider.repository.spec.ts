import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma';
import { ServiceProviderRepository } from './service-provider.repository';

describe('ServiceProviderRepository', () => {
  let repository: ServiceProviderRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServiceProviderRepository, PrismaService],
    }).compile();

    repository = module.get<ServiceProviderRepository>(
      ServiceProviderRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
