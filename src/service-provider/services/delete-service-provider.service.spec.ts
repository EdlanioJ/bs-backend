import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { serviceProviderStub } from '../../../test/mocks/stubs';
import { ServiceProviderRepository } from '../repositories';
import { DeleteServiceProviderService } from './delete-service-provider.service';

jest.mock('../repositories');

describe('DeleteServiceProviderService', () => {
  let service: DeleteServiceProviderService;
  let providerRepo: ServiceProviderRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DeleteServiceProviderService, ServiceProviderRepository],
    }).compile();
    service = module.get<DeleteServiceProviderService>(
      DeleteServiceProviderService,
    );
    providerRepo = module.get<ServiceProviderRepository>(
      ServiceProviderRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw a BadRequestException if service provider not found', async () => {
    const providerId = 'providerId';
    const userId = 'userId';
    const spy = jest.spyOn(providerRepo, 'findOne').mockResolvedValueOnce(null);
    const out = service.execute({ id: providerId, userId });
    await expect(out).rejects.toThrow(
      new BadRequestException('Service Provider not found'),
    );
    expect(spy).toHaveBeenCalledWith(providerId);
  });

  it('should throw a UnauthorizedException if user not owner', async () => {
    const providerId = 'providerId';
    const userId = 'userId';
    const serviceProvider = serviceProviderStub();
    serviceProvider.userId = 'otherUserId';
    jest.spyOn(providerRepo, 'findOne').mockResolvedValueOnce(serviceProvider);
    const out = service.execute({ id: providerId, userId });
    await expect(out).rejects.toThrow(
      new UnauthorizedException('Invalid user'),
    );
  });

  it('should delete service provider', async () => {
    const providerId = 'providerId';
    const userId = 'userId';
    const serviceProvider = serviceProviderStub();
    serviceProvider.userId = userId;
    jest.spyOn(providerRepo, 'findOne').mockResolvedValueOnce(serviceProvider);
    const spy = jest.spyOn(providerRepo, 'delete');
    await service.execute({ id: providerId, userId });
    expect(spy).toHaveBeenCalledWith(providerId);
  });
});
