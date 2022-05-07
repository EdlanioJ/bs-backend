import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { userStub } from '../../../test/mocks/stubs';
import { UserRepository } from '../../user/repositories';
import { AuthHelpers } from '../helpers';
import { RefreshTokensService } from './refresh-tokens.service';

jest.mock('../../user/repositories');
jest.mock('../helpers');

describe('RefreshTokensService', () => {
  let service: RefreshTokensService;
  let userRepo: UserRepository;
  let authHelpers: AuthHelpers;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefreshTokensService, UserRepository, AuthHelpers],
    }).compile();

    service = module.get<RefreshTokensService>(RefreshTokensService);
    userRepo = module.get<UserRepository>(UserRepository);
    authHelpers = module.get<AuthHelpers>(AuthHelpers);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw ForbiddenException if userRepo.findOne returns null', async () => {
    const userId = 'userId';
    const refreshToken = 'refreshToken';
    const spy = jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(null);
    const output = service.execute({ userId, refreshToken });
    await expect(output).rejects.toThrow(
      new ForbiddenException('access denied'),
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should throw ForbiddenException if userRepo.findOne returns user with no refreshToken', async () => {
    const userId = 'userId';
    const refreshToken = 'refreshToken';
    const user = userStub();
    const spy = jest
      .spyOn(userRepo, 'findOne')
      .mockResolvedValueOnce({ ...user, refreshToken: null });
    const output = service.execute({ userId, refreshToken });
    await expect(output).rejects.toThrow(
      new ForbiddenException('access denied'),
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should throw ForbiddenException if authHelpers.compareData return false', async () => {
    const userId = 'userId';
    const refreshToken = 'refreshToken';
    const user = { ...userStub(), refreshToken };
    const spy = jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);
    const compareSpy = jest
      .spyOn(authHelpers, 'compareData')
      .mockResolvedValueOnce(false);
    const output = service.execute({ userId, refreshToken });
    await expect(output).rejects.toThrow(
      new ForbiddenException('access denied'),
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(compareSpy).toHaveBeenCalledTimes(1);
    expect(compareSpy).toHaveBeenCalledWith(refreshToken, user.refreshToken);
  });
});
