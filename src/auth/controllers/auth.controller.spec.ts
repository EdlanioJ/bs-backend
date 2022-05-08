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
  let registerService: RegisterService;
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
    registerService = module.get<RegisterService>(RegisterService);
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

  describe('LocalAuth', () => {
    it('should LoginService return tokens', async () => {
      const spy = jest.spyOn(loginService, 'execute').mockResolvedValueOnce({
        accessToken: 'any_access_token',
        refreshToken: 'any_refresh_token',
      });

      const out = await controller.localAuth({
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

  describe('Register', () => {
    it('should call registerService.execute with correct values', async () => {
      const spy = jest.spyOn(registerService, 'execute');
      await controller.register({
        email: 'any_email',
        password: 'any_password',
        confirmPassword: 'any_password',
        name: 'any_username',
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        email: 'any_email',
        password: 'any_password',
        name: 'any_username',
      });
    });
  });
});
