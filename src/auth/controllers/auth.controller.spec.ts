import { Test, TestingModule } from '@nestjs/testing';
import {
  LoginService,
  LogoutService,
  RefreshTokensService,
  ValidateOAuthService,
} from '../services';
import { AuthController } from './auth.controller';

jest.mock('../services');

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        LoginService,
        LogoutService,
        RefreshTokensService,
        ValidateOAuthService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
