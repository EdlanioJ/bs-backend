import { Test } from '@nestjs/testing';
import { serviceStub } from '../../../test/stubs';
import { ServiceRepository } from '../repositories';
import { GetProviderServiceService } from './get-service.service';

jest.mock('../repositories');

describe('GetProviderServiceService', () => {
  let service: GetProviderServiceService;
  let serviceRepo: ServiceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetProviderServiceService, ServiceRepository],
    }).compile();
    service = module.get<GetProviderServiceService>(GetProviderServiceService);
    serviceRepo = module.get<ServiceRepository>(ServiceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a service', async () => {
    const serviceId = 'serviceId';
    const spy = jest
      .spyOn(serviceRepo, 'findOne')
      .mockResolvedValueOnce(serviceStub());
    const result = await service.execute({ id: serviceId });
    expect(spy).toHaveBeenCalledWith(serviceId);
    expect(result).toBeDefined();
  });
});
