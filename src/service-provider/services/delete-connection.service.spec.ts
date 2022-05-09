import { BadRequestException } from '@nestjs/common';
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
  let providerRepo: ServiceProviderRepository;

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
    providerRepo = module.get<ServiceProviderRepository>(
      ServiceProviderRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw a BadRequestException if the provider not found', async () => {
    const connectionId = 'connectionId';
    const userId = 'userId';
    const spy = jest
      .spyOn(providerRepo, 'findByUserId')
      .mockResolvedValueOnce(null);
    const out = service.execute({ connectionId, userId });
    await expect(out).rejects.toThrow(
      new BadRequestException('Provider not found'),
    );
    expect(spy).toHaveBeenCalledWith(userId);
  });
});
