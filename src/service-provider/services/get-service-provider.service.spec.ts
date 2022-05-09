import { Test } from '@nestjs/testing';
import { ServiceProviderRepository } from '../repositories';
import { GetServiceProviderService } from './get-service-provider.service';

jest.mock('../repositories');

describe('GetServiceProviderService', () => {
  let service: GetServiceProviderService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetServiceProviderService, ServiceProviderRepository],
    }).compile();
    service = module.get<GetServiceProviderService>(GetServiceProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
