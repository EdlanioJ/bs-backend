import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { RequireConnectionService } from './require-connection.service';
import { SendMailProducerService } from '../../mail/services';
import { UserRepository } from '../../user/repositories';
import {
  RequestConnectionRepository,
  ServiceProviderRepository,
} from '../repositories';
import { serviceProviderStub } from '../../../test/mocks/stubs';

jest.mock('../repositories');
jest.mock('../../user/repositories');
jest.mock('../../mail/services');

describe('RequireConnectionService', () => {
  let service: RequireConnectionService;
  let providerRepo: ServiceProviderRepository;
  let userRepo: UserRepository;

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
    userRepo = module.get<UserRepository>(UserRepository);
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

  it('should throw BadRequestException if user to connect not found', async () => {
    const providerOwnerId = 'providerOwnerId';
    const userToConnectId = 'userToConnectId';
    const provider = serviceProviderStub();
    jest.spyOn(providerRepo, 'findByUserId').mockResolvedValueOnce(provider);
    const spy = jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(null);
    const out = service.execute({ providerOwnerId, userToConnectId });
    await expect(out).rejects.toThrowError(
      new BadRequestException('User to connect not found'),
    );
    expect(spy).toHaveBeenCalledWith(userToConnectId);
  });
});
