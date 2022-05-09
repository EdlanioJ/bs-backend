import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { userStub } from '../../../test/mocks/stubs';
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
});
