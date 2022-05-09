import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { serviceProviderStub } from '../../../test/mocks/stubs';
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
  let providerConnectionRepo: ProviderConnectionRepository;

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
    providerConnectionRepo = module.get<ProviderConnectionRepository>(
      ProviderConnectionRepository,
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

  it('should throw a BadRequestException if the provider connection not found', async () => {
    const connectionId = 'connectionId';
    const userId = 'userId';
    const serviceProvider = serviceProviderStub();
    jest
      .spyOn(providerRepo, 'findByUserId')
      .mockResolvedValueOnce(serviceProvider);
    const spy = jest
      .spyOn(providerConnectionRepo, 'findOne')
      .mockResolvedValueOnce(null);
    const out = service.execute({ connectionId, userId });
    await expect(out).rejects.toThrow(
      new BadRequestException('Connection not found'),
    );
    expect(spy).toHaveBeenCalledWith(connectionId);
  });
});
