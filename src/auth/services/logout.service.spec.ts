import { Test, TestingModule } from '@nestjs/testing';
import { LogoutService } from './logout.service';
import { UserRepository } from '../../user/repositories';

jest.mock('../../user/repositories');

describe('LogoutService', () => {
  let service: LogoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogoutService, UserRepository],
    }).compile();

    service = module.get<LogoutService>(LogoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
