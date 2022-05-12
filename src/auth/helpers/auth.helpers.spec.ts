import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import {
  mockedConfigService,
  mockedJwtService,
} from '../../../test/mocks/services';
import { TokensModel } from '../models';
import { AuthHelpers } from './auth.helpers';

describe('AuthHelpers', () => {
  let authHelpers: AuthHelpers;
  let jwtSecret: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthHelpers,
        { provide: ConfigService, useValue: mockedConfigService },
        { provide: JwtService, useValue: mockedJwtService },
      ],
    }).compile();
    authHelpers = module.get<AuthHelpers>(AuthHelpers);
    jwtSecret = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authHelpers).toBeDefined();
  });

  describe('generateTokens', () => {
    it('should return tokens', async () => {
      const userId = 'any_user_id';
      const username = 'any_username';
      const role = 'any_role';
      const spy = jest.spyOn(jwtSecret, 'signAsync');
      const tokens = await authHelpers.generateTokens(userId, username, role);
      expect(spy).toHaveBeenNthCalledWith(
        1,
        {
          sub: userId,
          username,
          role,
        },
        {
          expiresIn: mockedConfigService.get('JWT_SECRET_EXPIRE_IN'),
          secret: mockedConfigService.get('JWT_SECRET'),
        },
      );
      expect(spy).toHaveBeenNthCalledWith(
        2,
        {
          sub: userId,
          username,
          role,
        },
        {
          expiresIn: mockedConfigService.get('REFRESH_TOKEN_EXPIRE_IN'),
          secret: mockedConfigService.get('JWT_REFRESH_SECRET'),
        },
      );
      expect(tokens).toEqual(
        new TokensModel({
          accessToken: 'any_token',
          refreshToken: 'any_token',
        }),
      );
    });
  });
});
