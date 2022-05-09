import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { RequireConnectionService } from './require-connection.service';
import { SendMailProducerService } from '../../mail/services';
import { UserRepository } from '../../user/repositories';
import {
  RequestConnectionRepository,
  ServiceProviderRepository,
} from '../repositories';
import {
  serviceProviderStub,
  userStub,
  connectionRequestStub,
} from '../../../test/mocks/stubs';

jest.mock('../repositories');
jest.mock('../../user/repositories');
jest.mock('../../mail/services');

describe('RequireConnectionService', () => {
  let service: RequireConnectionService;
  let providerRepo: ServiceProviderRepository;
  let userRepo: UserRepository;
  let requestConnectionRepo: RequestConnectionRepository;
  let sendMailProducerService: SendMailProducerService;

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
    requestConnectionRepo = module.get<RequestConnectionRepository>(
      RequestConnectionRepository,
    );
    sendMailProducerService = module.get<SendMailProducerService>(
      SendMailProducerService,
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

  it('should throw BadRequestException if user to connect is not a valid user', async () => {
    const providerOwnerId = 'providerOwnerId';
    const userToConnectId = 'userToConnectId';
    const provider = serviceProviderStub();
    const user = userStub();
    user.role = 'ADMIN';
    jest.spyOn(providerRepo, 'findByUserId').mockResolvedValueOnce(provider);
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);
    const out = service.execute({ providerOwnerId, userToConnectId });
    await expect(out).rejects.toThrowError(
      new BadRequestException('Not a valid user to connect'),
    );
  });

  it('should throw BadRequestException if connection request already sent', async () => {
    const providerOwnerId = 'providerOwnerId';
    const userToConnectId = 'userToConnectId';
    const provider = serviceProviderStub();
    const user = userStub();
    const requestConnection = connectionRequestStub();
    user.role = 'USER';
    jest.spyOn(providerRepo, 'findByUserId').mockResolvedValueOnce(provider);
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);
    const spy = jest
      .spyOn(requestConnectionRepo, 'findAvailable')
      .mockResolvedValueOnce(requestConnection);
    const out = service.execute({ providerOwnerId, userToConnectId });
    await expect(out).rejects.toThrowError(
      new BadRequestException('Connection request already sent'),
    );
    expect(spy).toHaveBeenCalledWith(provider.id, user.id);
  });

  it('should create a connection request', async () => {
    const providerOwnerId = 'providerOwnerId';
    const userToConnectId = 'userToConnectId';
    const provider = serviceProviderStub();
    const user = userStub();
    const requestConnection = connectionRequestStub();
    user.role = 'USER';
    jest.spyOn(providerRepo, 'findByUserId').mockResolvedValueOnce(provider);
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(requestConnectionRepo, 'findAvailable')
      .mockResolvedValueOnce(null);
    const createSpy = jest
      .spyOn(requestConnectionRepo, 'create')
      .mockResolvedValueOnce(requestConnection);
    const sendMailSpy = jest.spyOn(sendMailProducerService, 'execute');
    await service.execute({ providerOwnerId, userToConnectId });
    expect(createSpy).toHaveBeenCalledWith({
      provider: { connect: { id: provider.id } },
      employee: { connect: { id: user.id } },
    });
    expect(sendMailSpy).toHaveBeenCalledWith({
      to: user.email,
      type: 'connection-request',
      content: [
        {
          key: 'name',
          value: user.name,
        },
        {
          key: 'providerName',
          value: provider.name,
        },
        {
          key: 'requestConnectionId',
          value: requestConnection.id,
        },
      ],
    });
  });
});
