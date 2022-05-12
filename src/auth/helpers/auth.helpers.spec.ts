import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import {
  mockedConfigService,
  mockedJwtService,
} from '../../../test/mocks/services';
import { AuthHelpers } from './auth.helpers';

describe('AuthHelpers', () => {
  let authHelpers: AuthHelpers;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthHelpers,
        { provide: ConfigService, useValue: mockedConfigService },
        { provide: JwtService, useValue: mockedJwtService },
      ],
    }).compile();
    authHelpers = module.get<AuthHelpers>(AuthHelpers);
  });

  it('should be defined', () => {
    expect(authHelpers).toBeDefined();
  });
});
