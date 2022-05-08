import { Test, TestingModule } from '@nestjs/testing';
import {
  LoginService,
  LogoutService,
  RefreshTokensService,
  ForgotPasswordService,
  ResetPasswordService,
  RegisterService,
  ValidateWithCredentialsService,
  ValidateOAuthService,
} from '../services';
import { AuthController } from './auth.controller';

jest.mock('../services');

describe('AuthController', () => {
  let controller: AuthController;
  let loginService: LoginService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        LoginService,
        ForgotPasswordService,
        ResetPasswordService,
        RegisterService,
        ValidateWithCredentialsService,
        LogoutService,
        RefreshTokensService,
        ValidateOAuthService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    loginService = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GoogleAuthCallback', () => {
    it('should LoginService return tokens', async () => {
      const spy = jest.spyOn(loginService, 'execute').mockResolvedValueOnce({
        accessToken: 'any_access_token',
        refreshToken: 'any_refresh_token',
      });

      const out = await controller.googleAuthCallback({
        role: 'any_role',
        sub: 'any_sub',
        username: 'any_username',
      });

      expect(out).toEqual({
        accessToken: 'any_access_token',
        refreshToken: 'any_refresh_token',
      });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        role: 'any_role',
        sub: 'any_sub',
        username: 'any_username',
      });
    });
  });
});
