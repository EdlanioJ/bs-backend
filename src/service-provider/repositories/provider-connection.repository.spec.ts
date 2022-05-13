import { Test } from '@nestjs/testing';
import { connectionRequestStub } from '../../../test/stubs';
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

  it('should find all provider connections', async () => {
    const providerConnection = connectionRequestStub();
    prisma.providerConnection.findMany = jest
      .fn()
      .mockResolvedValueOnce([providerConnection]);
    const result = await repository.findAll({
      where: {
        id: 'providerConnectionId',
      },
    });
    expect(result).toEqual([providerConnection]);
  });

  it('should count provider connections', async () => {
    prisma.providerConnection.count = jest.fn().mockResolvedValueOnce(1);
    const result = await repository.count();
    expect(result).toBe(1);
  });

  it('should delete provider connection', async () => {
    const providerConnection = connectionRequestStub();
    prisma.providerConnection.delete = jest
      .fn()
      .mockResolvedValueOnce(providerConnection);
    const result = await repository.delete('providerConnectionId');
    expect(result).toBe(providerConnection);
  });
});
