import { Test } from '@nestjs/testing';
import { ProviderConnectionRepository } from '../repositories';
import { ListConnectionService } from './list-connection.service';

jest.mock('../repositories');

describe('ListConnectionService', () => {
  let service: ListConnectionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ListConnectionService, ProviderConnectionRepository],
    }).compile();
    service = module.get<ListConnectionService>(ListConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
