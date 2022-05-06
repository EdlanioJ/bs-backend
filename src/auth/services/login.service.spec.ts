import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../user/repositories';
import { AuthHelpers } from '../helpers';
import { LoginService } from './login.service';

jest.mock('../helpers');
jest.mock('../../user/repositories');

describe('LoginService', () => {
  let service: LoginService;
  let authHelpers: AuthHelpers;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginService, UserRepository, AuthHelpers],
    }).compile();

    service = module.get<LoginService>(LoginService);
    authHelpers = module.get<AuthHelpers>(AuthHelpers);
    userRepo = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const input = {
    sub: 'any_sub',
    username: 'any_username',
    role: 'any_role',
  };

  it('should return tokens', async () => {
    const tokens = {
      accessToken: 'any_access_token',
      refreshToken: 'any_refresh_token',
    };

    const generateTokenSpy = jest
      .spyOn(authHelpers, 'generateTokens')
      .mockResolvedValue(tokens);
    const hashSpy = jest
      .spyOn(authHelpers, 'hashData')
      .mockResolvedValue('any_hash');
    const updateSpy = jest.spyOn(userRepo, 'update');

    const output = await service.execute(input);

    expect(output).toEqual(tokens);
    expect(generateTokenSpy).toHaveBeenCalledWith(
      input.sub,
      input.username,
      input.role,
    );
    expect(hashSpy).toHaveBeenCalledWith(tokens.refreshToken);
    expect(updateSpy).toHaveBeenCalledWith(input.sub, {
      refreshToken: 'any_hash',
    });
  });
});
