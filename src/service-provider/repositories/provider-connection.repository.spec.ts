import { Test } from '@nestjs/testing';
import { connectionRequestStub } from '../../../test/mocks/stubs';
import { PrismaService } from '../../prisma';
import { ProviderConnectionRepository } from './provider-connection.repository';

describe('ProviderConnectionRepository', () => {
  let repository: ProviderConnectionRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProviderConnectionRepository, PrismaService],
    }).compile();

    repository = module.get<ProviderConnectionRepository>(
      ProviderConnectionRepository,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create a provider connection', async () => {
    const providerConnection = connectionRequestStub();
    prisma.providerConnection.create = jest
      .fn()
      .mockResolvedValueOnce(providerConnection);
    const result = await repository.create({
      provider: { connect: { id: 'providerId' } },
      user: { connect: { id: 'userId' } },
    });
    expect(result).toBe(providerConnection);
  });

  it('should find one provider connection', async () => {
    const providerConnection = connectionRequestStub();
    prisma.providerConnection.findFirst = jest
      .fn()
      .mockResolvedValueOnce(providerConnection);
    const result = await repository.findOne('providerConnectionId');
    expect(result).toBe(providerConnection);
  });
});
