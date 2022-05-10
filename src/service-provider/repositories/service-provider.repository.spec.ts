import { Test } from '@nestjs/testing';
import { serviceProviderStub } from '../../../test/mocks/stubs';
import { PrismaService } from '../../prisma';
import { ServiceProviderRepository } from './service-provider.repository';
const serviceProvider = serviceProviderStub();

const db = {
  serviceProvider: {
    create: jest.fn().mockResolvedValue(serviceProvider),
    findFirst: jest.fn().mockResolvedValue(serviceProvider),
  },
};

describe('ServiceProviderRepository', () => {
  let repository: ServiceProviderRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServiceProviderRepository,
        { provide: PrismaService, useValue: db },
      ],
    }).compile();

    repository = module.get<ServiceProviderRepository>(
      ServiceProviderRepository,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create service provider', async () => {
    const spy = jest.spyOn(prisma.serviceProvider, 'create');
    const result = await repository.create({
      user: { connect: { id: 'userId' } },
      name: 'name',
    });
    expect(result).toBe(serviceProvider);
    expect(spy).toHaveBeenCalledWith({
      data: {
        user: { connect: { id: 'userId' } },
        name: 'name',
      },
    });
  });

  it('should find one service provider', async () => {
    const spy = jest.spyOn(prisma.serviceProvider, 'findFirst');
    const result = await repository.findOne('serviceProviderId');
    expect(result).toBe(serviceProvider);
    expect(spy).toHaveBeenCalledWith({
      where: {
        id: 'serviceProviderId',
      },
    });
  });
});
