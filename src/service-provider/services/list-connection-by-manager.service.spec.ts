import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  ProviderConnectionRepository,
  ServiceProviderRepository,
} from '../repositories';
import { ListConnectionByManagerService } from './list-connection-by-manager.service';

jest.mock('../repositories');

describe('ListConnectionByManagerService', () => {
  let service: ListConnectionByManagerService;
  let providerRepo: ServiceProviderRepository;

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
    providerRepo = module.get<ServiceProviderRepository>(
      ServiceProviderRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if provider not found', async () => {
    const userId = 'userId';
    const page = 1;
    const limit = 10;
    const spy = jest
      .spyOn(providerRepo, 'findByUserId')
      .mockResolvedValue(null);
    const out = service.execute({ userId, page, limit });
    await expect(out).rejects.toThrowError(
      new BadRequestException('user has not a provider'),
    );
    expect(spy).toHaveBeenCalledWith(userId);
  });
});
