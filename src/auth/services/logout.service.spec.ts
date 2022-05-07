import { Test, TestingModule } from '@nestjs/testing';
import { LogoutService } from './logout.service';
import { UserRepository } from '../../user/repositories';

jest.mock('../../user/repositories');

describe('LogoutService', () => {
  let service: LogoutService;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogoutService, UserRepository],
    }).compile();

    service = module.get<LogoutService>(LogoutService);
    userRepo = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call userRepo.update with correct params', async () => {
    const userId = 'userId';
    const spy = jest.spyOn(userRepo, 'update');
    await service.execute({ userId });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(userId, { refreshToken: null });
  });
});
