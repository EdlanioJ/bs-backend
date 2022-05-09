import { Test } from '@nestjs/testing';
import { ServiceRepository } from '../repositories';
import { ListProviderServiceService } from './list-service.service';

jest.mock('../repositories');

describe('ListProviderServiceService', () => {
  let service: ListProviderServiceService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ListProviderServiceService, ServiceRepository],
    }).compile();
    service = module.get<ListProviderServiceService>(
      ListProviderServiceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
