import { Test } from '@nestjs/testing';
import {
  ProviderConnectionRepository,
  ServiceProviderRepository,
} from '../repositories';
import { ListConnectionByManagerService } from './list-connection-by-manager.service';

jest.mock('../repositories');

describe('ListConnectionByManagerService', () => {
  let service: ListConnectionByManagerService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
