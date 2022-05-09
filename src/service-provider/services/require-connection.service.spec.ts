import { Test } from '@nestjs/testing';
import { RequireConnectionService } from './require-connection.service';
import { SendMailProducerService } from '../../mail/services';
import { UserRepository } from '../../user/repositories';
import {
  RequestConnectionRepository,
  ServiceProviderRepository,
} from '../repositories';
import { BadRequestException } from '@nestjs/common';

jest.mock('../repositories');
jest.mock('../../user/repositories');
jest.mock('../../mail/services');

describe('RequireConnectionService', () => {
  let service: RequireConnectionService;
  let providerRepo: ServiceProviderRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RequireConnectionService,
        UserRepository,
        ServiceProviderRepository,
        RequestConnectionRepository,
        SendMailProducerService,
      ],
    }).compile();

    service = module.get<RequireConnectionService>(RequireConnectionService);
    providerRepo = module.get<ServiceProviderRepository>(
      ServiceProviderRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if provider not found', async () => {
    const providerOwnerId = 'providerOwnerId';
    const userToConnectId = 'userToConnectId';
    const spy = jest
      .spyOn(providerRepo, 'findByUserId')
      .mockResolvedValueOnce(null);
    const out = service.execute({ providerOwnerId, userToConnectId });
    await expect(out).rejects.toThrowError(
      new BadRequestException('Provider not found'),
    );
    expect(spy).toHaveBeenCalledWith(providerOwnerId);
  });
});
