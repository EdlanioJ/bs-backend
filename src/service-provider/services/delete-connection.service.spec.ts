import { Test } from '@nestjs/testing';
import {
  ProviderConnectionRepository,
  RequestConnectionRepository,
  ServiceProviderRepository,
} from '../repositories';
import { DeleteConnectionService } from './delete-connection.service';

jest.mock('../repositories');

describe('DeleteConnectionService', () => {
  let service: DeleteConnectionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteConnectionService,
        RequestConnectionRepository,
        ServiceProviderRepository,
        ProviderConnectionRepository,
      ],
    }).compile();
    service = module.get<DeleteConnectionService>(DeleteConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
