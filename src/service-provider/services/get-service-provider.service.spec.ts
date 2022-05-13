import { Test } from '@nestjs/testing';
import { serviceProviderStub } from '../../../test/stubs';
import { ServiceProviderRepository } from '../repositories';
import { GetServiceProviderService } from './get-service-provider.service';

jest.mock('../repositories');

describe('GetServiceProviderService', () => {
  let service: GetServiceProviderService;
  let providerRepo: ServiceProviderRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetServiceProviderService, ServiceProviderRepository],
    }).compile();
    service = module.get<GetServiceProviderService>(GetServiceProviderService);
    providerRepo = module.get<ServiceProviderRepository>(
      ServiceProviderRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a service provider', async () => {
    const providerId = 'providerId';
    const serviceProvider = serviceProviderStub();
    const spy = jest
      .spyOn(providerRepo, 'findOne')
      .mockResolvedValueOnce(serviceProvider);
    const out = await service.execute({ id: providerId });
    expect(out.id).toBe(serviceProvider.id);
    expect(spy).toHaveBeenCalledWith(providerId);
  });
});
