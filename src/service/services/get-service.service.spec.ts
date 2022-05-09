import { Test } from '@nestjs/testing';
import { ServiceRepository } from '../repositories';
import { GetProviderServiceService } from './get-service.service';

jest.mock('../repositories');

describe('GetProviderServiceService', () => {
  let service: GetProviderServiceService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetProviderServiceService, ServiceRepository],
    }).compile();
    service = module.get<GetProviderServiceService>(GetProviderServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
