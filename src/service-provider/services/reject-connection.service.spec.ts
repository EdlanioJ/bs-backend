import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { connectionRequestStub, userStub } from '../../../test/stubs';
import { UserRepository } from '../../user/repositories';
import { RequestConnectionRepository } from '../repositories';
import { RejectConnectionService } from './reject-connection.service';

jest.mock('../repositories');
jest.mock('../../user/repositories');

describe('RejectConnectionService', () => {
  let service: RejectConnectionService;
  let userRepo: UserRepository;
  let requestConnectionRepo: RequestConnectionRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RejectConnectionService,
        UserRepository,
        RequestConnectionRepository,
      ],
    }).compile();

    service = module.get<RejectConnectionService>(RejectConnectionService);
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
    const spy = jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(null);
    const out = service.execute({ userId, requestId });
    await expect(out).rejects.toThrowError(
      new BadRequestException('User not found'),
    );
    expect(spy).toHaveBeenCalledWith(userId);
  });

  it('should throw BadRequestException if user is not a valid user', async () => {
    const userId = 'userId';
    const requestId = 'requestId';
    const user = userStub();
    user.role = 'ADMIN';
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);
    const out = service.execute({ userId, requestId });
    await expect(out).rejects.toThrowError(
      new BadRequestException('Not a valid user'),
    );
  });

  it('should throw BadRequestException if connection not found', async () => {
    const userId = 'userId';
    const requestId = 'requestId';
    const user = userStub();
    user.role = 'USER';
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);
    const spy = jest
      .spyOn(requestConnectionRepo, 'findOne')
      .mockResolvedValueOnce(null);
    const out = service.execute({ userId, requestId });
    await expect(out).rejects.toThrowError(
      new BadRequestException('Connection not found'),
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
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(requestConnectionRepo, 'findOne')
      .mockResolvedValueOnce(requestConnection);
    const out = service.execute({ userId, requestId });
    await expect(out).rejects.toThrowError(
      new BadRequestException('Connection already accepted'),
    );
  });

  it('should throw BadRequestException if connection already rejected', async () => {
    const userId = 'userId';
    const requestId = 'requestId';
    const user = userStub();
    user.role = 'USER';
    const requestConnection = connectionRequestStub();
    requestConnection.status = 'REJECTED';
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(requestConnectionRepo, 'findOne')
      .mockResolvedValueOnce(requestConnection);
    const out = service.execute({ userId, requestId });
    await expect(out).rejects.toThrowError(
      new BadRequestException('Connection already rejected'),
    );
  });

  it('should throw UnauthorizedException if user not authorized', async () => {
    const userId = 'userId';
    const requestId = 'requestId';
    const user = userStub();
    user.role = 'USER';
    const requestConnection = connectionRequestStub();
    requestConnection.status = 'PENDING';
    requestConnection.employeeId = 'userId2';
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(requestConnectionRepo, 'findOne')
      .mockResolvedValueOnce(requestConnection);
    const out = service.execute({ userId, requestId });
    await expect(out).rejects.toThrowError(
      new UnauthorizedException('User not authorized'),
    );
  });

  it('should reject connection', async () => {
    const userId = 'userId';
    const requestId = 'requestId';
    const user = userStub();
    user.role = 'USER';
    const requestConnection = connectionRequestStub();
    requestConnection.status = 'PENDING';
    requestConnection.employeeId = userId;
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(requestConnectionRepo, 'findOne')
      .mockResolvedValueOnce(requestConnection);
    const spy = jest.spyOn(requestConnectionRepo, 'update');
    const out = service.execute({ userId, requestId });
    await expect(out).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledWith(requestId, { status: 'REJECTED' });
  });
});
