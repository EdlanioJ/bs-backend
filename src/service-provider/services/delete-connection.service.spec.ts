import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  serviceProviderStub,
  providerConnectionStub,
} from '../../../test/mocks/stubs';
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
  let requestConnectionRepo: RequestConnectionRepository;

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
    requestConnectionRepo = module.get<RequestConnectionRepository>(
      RequestConnectionRepository,
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

  it('should throw a BadRequestException if the provider connection not valid', async () => {
    const connectionId = 'connectionId';
    const userId = 'userId';
    const serviceProvider = serviceProviderStub();
    const providerConnection = providerConnectionStub();
    jest
      .spyOn(providerRepo, 'findByUserId')
      .mockResolvedValueOnce(serviceProvider);
    jest
      .spyOn(providerConnectionRepo, 'findOne')
      .mockResolvedValueOnce(providerConnection);
    const out = service.execute({ connectionId, userId });
    await expect(out).rejects.toThrow(
      new BadRequestException('Connection not found'),
    );
  });

  it('should delete the provider connection', async () => {
    const connectionId = 'connectionId';
    const userId = 'userId';
    const serviceProvider = serviceProviderStub();
    const providerConnection = providerConnectionStub();
    providerConnection.providerId = serviceProvider.id;
    jest
      .spyOn(providerRepo, 'findByUserId')
      .mockResolvedValueOnce(serviceProvider);
    jest
      .spyOn(providerConnectionRepo, 'findOne')
      .mockResolvedValueOnce(providerConnection);
    const deleteSpy = jest.spyOn(providerConnectionRepo, 'delete');
    const findRequestSpy = jest
      .spyOn(requestConnectionRepo, 'findAvailable')
      .mockResolvedValueOnce(null);
    await service.execute({ connectionId, userId });
    expect(deleteSpy).toHaveBeenCalledWith(connectionId);
    expect(findRequestSpy).toHaveBeenCalledWith(
      serviceProvider.id,
      providerConnection.userId,
    );
  });
});
