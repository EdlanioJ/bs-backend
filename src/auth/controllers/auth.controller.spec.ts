import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import httpMock from 'node-mocks-http';

import {
  LoginService,
  LogoutService,
  RefreshTokensService,
  ForgotPasswordService,
  ResetPasswordService,
  RegisterService,
} from '../services';
import { AuthController } from './auth.controller';

jest.mock('../services');
jest.mock('@nestjs/config');

describe('AuthController', () => {
  let controller: AuthController;
  let loginService: LoginService;
  let registerService: RegisterService;
  let forgotPasswordService: ForgotPasswordService;
  let resetPasswordService: ResetPasswordService;
  let refreshTokensService: RefreshTokensService;
  let logoutService: LogoutService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        LoginService,
        ForgotPasswordService,
        ResetPasswordService,
        RegisterService,
        LogoutService,
        RefreshTokensService,
        ConfigService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    loginService = module.get<LoginService>(LoginService);
    registerService = module.get<RegisterService>(RegisterService);
    forgotPasswordService = module.get<ForgotPasswordService>(
      ForgotPasswordService,
    );
    resetPasswordService =
      module.get<ResetPasswordService>(ResetPasswordService);
    refreshTokensService =
      module.get<RefreshTokensService>(RefreshTokensService);
    logoutService = module.get<LogoutService>(LogoutService);
    configService = module.get<ConfigService>(ConfigService);
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

  describe('GoogleMobileAuthCallback', () => {
    it('should LoginService return tokens', async () => {
      const spy = jest.spyOn(loginService, 'execute').mockResolvedValueOnce({
        accessToken: 'any_access_token',
        refreshToken: 'any_refresh_token',
      });

      const spyGetEnvHost = jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce('host');

      const spyGetEnvPathname = jest
        .spyOn(configService, 'get')
        .mockReturnValue('pathname');
      const res = httpMock.createResponse();

      await controller.googleCallbackMobile(res, {
        role: 'any_role',
        sub: 'any_sub',
        username: 'any_username',
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spyGetEnvHost).toHaveBeenCalledWith('MOBILE_AUTH_HOSTNAME');
      expect(spyGetEnvPathname).toHaveBeenCalledWith('MOBILE_AUTH_PATHNAME');
      expect(spy).toHaveBeenCalledWith({
        role: 'any_role',
        sub: 'any_sub',
        username: 'any_username',
      });
      expect(res._getRedirectUrl()).toBe(
        'https://host/pathname?access_token=any_access_token&refresh_token=any_refresh_token',
      );
    });
  });

  describe('GoogleAuth', () => {
    it('should have been called', async () => {
      const spy = jest.spyOn(controller, 'googleAuth');
      controller.googleAuth();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('GoogleMobileAuth', () => {
    it('should have been called', async () => {
      const spy = jest.spyOn(controller, 'mobileGoogleAuth');
      controller.mobileGoogleAuth();
      expect(spy).toHaveBeenCalledTimes(1);
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

  describe('ForgotPassword', () => {
    it('should call forgotPasswordService with correct values', async () => {
      const spy = jest.spyOn(forgotPasswordService, 'execute');
      await controller.forgotPassword({ email: 'any_email' });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ email: 'any_email' });
    });
  });

  describe('ResetPassword', () => {
    it('should call resetPasswordService with correct values', async () => {
      const spy = jest.spyOn(resetPasswordService, 'execute');
      await controller.resetPassword(
        {
          confirmPassword: 'any_password',
          password: 'any_password',
        },
        'any_token',
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        password: 'any_password',
        token: 'any_token',
      });
    });
  });

  describe('RefreshTokens', () => {
    it('should refreshTokensService return tokens', async () => {
      const spy = jest
        .spyOn(refreshTokensService, 'execute')
        .mockResolvedValueOnce({
          accessToken: 'any_access_token',
          refreshToken: 'any_refresh_token',
        });
      const out = await controller.refreshTokens('any_user_id', 'any_token');
      expect(out).toEqual({
        accessToken: 'any_access_token',
        refreshToken: 'any_refresh_token',
      });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        userId: 'any_user_id',
        refreshToken: 'any_token',
      });
    });
  });

  describe('LogoutService', () => {
    it('should call logoutService with correct values', async () => {
      const spy = jest.spyOn(logoutService, 'execute');
      await controller.logout('any_user_id');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ userId: 'any_user_id' });
    });
  });
});
