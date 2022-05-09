import { Test } from '@nestjs/testing';
import { ServiceProviderRepository } from '../repositories';
import { DeleteServiceProviderService } from './delete-service-provider.service';

jest.mock('../repositories');

describe('DeleteServiceProviderService', () => {
  let service: DeleteServiceProviderService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DeleteServiceProviderService, ServiceProviderRepository],
    }).compile();
    service = module.get<DeleteServiceProviderService>(
      DeleteServiceProviderService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
