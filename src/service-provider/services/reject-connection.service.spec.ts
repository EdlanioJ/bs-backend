import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { userStub } from '../../../test/mocks/stubs';
import { UserRepository } from '../../user/repositories';
import { RequestConnectionRepository } from '../repositories';
import { RejectConnectionService } from './reject-connection.service';

jest.mock('../repositories');
jest.mock('../../user/repositories');

describe('RejectConnectionService', () => {
  let service: RejectConnectionService;
  let userRepo: UserRepository;

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
});
