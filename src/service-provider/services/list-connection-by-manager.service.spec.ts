import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  providerConnectionStub,
  serviceProviderStub,
} from '../../../test/mocks/stubs';
import {
  ProviderConnectionRepository,
  ServiceProviderRepository,
} from '../repositories';
import { ListConnectionByManagerService } from './list-connection-by-manager.service';

jest.mock('../repositories');

describe('ListConnectionByManagerService', () => {
  let service: ListConnectionByManagerService;
  let providerRepo: ServiceProviderRepository;
  let providerConnectionRepo: ProviderConnectionRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ListConnectionByManagerService,
        ServiceProviderRepository,
        ProviderConnectionRepository,
      ],
    }).compile();
    service = module.get<ListConnectionByManagerService>(
      ListConnectionByManagerService,
    );
    providerRepo = module.get<ServiceProviderRepository>(
      ServiceProviderRepository,
    );
    providerConnectionRepo = module.get<ProviderConnectionRepository>(
      ProviderConnectionRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if provider not found', async () => {
    const userId = 'userId';
    const page = 1;
    const limit = 10;
    const spy = jest
      .spyOn(providerRepo, 'findByUserId')
      .mockResolvedValue(null);
    const out = service.execute({ userId, page, limit });
    await expect(out).rejects.toThrowError(
      new BadRequestException('user has not a provider'),
    );
    expect(spy).toHaveBeenCalledWith(userId);
  });

  it('should return provider connections', async () => {
    const userId = 'userId';
    const page = 1;
    const limit = 10;
    const serviceProvider = serviceProviderStub();
    const providerConnection = providerConnectionStub();
    jest.spyOn(providerRepo, 'findByUserId').mockResolvedValue(serviceProvider);
    const findSpy = jest
      .spyOn(providerConnectionRepo, 'findAll')
      .mockResolvedValue([providerConnection]);
    const countSpy = jest
      .spyOn(providerConnectionRepo, 'count')
      .mockResolvedValue(1);
    const out = await service.execute({ userId, page, limit });
    expect(out.total).toBe(1);
    expect(out.data).toHaveLength(1);
    expect(findSpy).toHaveBeenCalledWith({
      skip: Number((page - 1) * limit),
      take: Number(limit),
      where: {
        providerId: serviceProvider.id,
      },
    });
    expect(countSpy).toHaveBeenCalledWith({
      where: {
        providerId: serviceProvider.id,
      },
    });
  });
});
