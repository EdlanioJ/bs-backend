import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import {
  mockedConfigService,
  mockedJwtService,
} from '../../../test/mocks/services';
import { TokensModel } from '../models';
import { AuthHelpers } from './auth.helpers';

jest.mock('bcrypt');

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

  describe('hashData', () => {
    it('should return hashed data', async () => {
      const data = 'any_data';
      const saltSpy = jest
        .spyOn(bcrypt, 'genSaltSync')
        .mockReturnValue('any_salt');
      const hashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue('any_hash' as never);
      const hash = await authHelpers.hashData(data);
      expect(hash).toBe('any_hash');
      expect(saltSpy).toHaveBeenCalledWith(12);
      expect(hashSpy).toHaveBeenCalledWith(data, 'any_salt');
    });
  });

  describe('compareData', () => {
    it('should return true', async () => {
      const data = 'any_data';
      const hash = 'any_hash';
      const spy = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(true as never);
      const result = await authHelpers.compareData(data, hash);
      expect(result).toBeTruthy();
      expect(spy).toHaveBeenCalledWith(data, hash);
    });
    it('should return false', async () => {
      const data = 'any_data';
      const hash = 'any_hash';
      const spy = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(false as never);
      const result = await authHelpers.compareData(data, hash);
      expect(result).toBeFalsy();
      expect(spy).toHaveBeenCalledWith(data, hash);
    });
  });
});
