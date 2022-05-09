import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { userStub, connectionRequestStub } from '../../../test/mocks/stubs';
import { UserRepository } from '../../user/repositories';
import {
  ProviderConnectionRepository,
  RequestConnectionRepository,
} from '../repositories';
import { AcceptConnectionService } from './accept-connection.service';

jest.mock('../../user/repositories');
jest.mock('../repositories');

describe('AcceptConnectionService', () => {
  let service: AcceptConnectionService;
  let userRepo: UserRepository;
  let requestConnectionRepo: RequestConnectionRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AcceptConnectionService,
        UserRepository,
        ProviderConnectionRepository,
        RequestConnectionRepository,
      ],
    }).compile();
    service = module.get<AcceptConnectionService>(AcceptConnectionService);
    userRepo = module.get<UserRepository>(UserRepository);
    requestConnectionRepo = module.get<RequestConnectionRepository>(
      RequestConnectionRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if user not found', async () => {
    const userId = 'userId';
    const requestId = 'requestId';
    const findSpy = jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

    const out = service.execute({ userId, requestId });
    await expect(out).rejects.toThrow(
      new BadRequestException('User not found'),
    );
    expect(findSpy).toHaveBeenCalledWith(userId);
  });

  it('should throw BadRequestException if user is not a valid user', async () => {
    const userId = 'userId';
    const requestId = 'requestId';
    const user = userStub();
    user.role = 'ADMIN';
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    const out = service.execute({ userId, requestId });
    await expect(out).rejects.toThrow(
      new BadRequestException('Not a valid user'),
    );
  });

  it('should throw BadRequestException if connection request not found', async () => {
    const userId = 'userId';
    const requestId = 'requestId';
    const user = userStub();
    user.role = 'USER';
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    const spy = jest
      .spyOn(requestConnectionRepo, 'findOne')
      .mockResolvedValue(null);
    const out = service.execute({ userId, requestId });
    await expect(out).rejects.toThrow(
      new BadRequestException('Connection Request not found'),
    );
    expect(spy).toHaveBeenCalledWith(requestId);
  });

  it('should throw BadRequestException if connection already accepted', async () => {
    const userId = 'userId';
    const requestId = 'requestId';
    const user = userStub();
    user.role = 'USER';
    const requestConnection = connectionRequestStub();
    requestConnection.status = 'ACCEPTED';
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    jest
      .spyOn(requestConnectionRepo, 'findOne')
      .mockResolvedValue(requestConnection);
    const out = service.execute({ userId, requestId });
    await expect(out).rejects.toThrow(
      new BadRequestException('Connection already accepted'),
    );
  });
});
