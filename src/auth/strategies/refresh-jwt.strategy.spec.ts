import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { createRequest } from 'node-mocks-http';
import { mockedConfigService } from '../../../test/mocks/services';
import { RefreshJwtStrategy } from './index';

describe('RefreshJwtStrategy', () => {
  let strategy: RefreshJwtStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RefreshJwtStrategy,
        { provide: ConfigService, useValue: mockedConfigService },
      ],
    }).compile();
    strategy = module.get<RefreshJwtStrategy>(RefreshJwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate and return payload', async () => {
    const payload = { sub: 'id', username: 'username', role: 'role' };
    const req = createRequest();
    req.headers.authorization = 'Bearer token';
    const out = await strategy.validate(req, payload);
    expect(out).toEqual({ ...payload, refreshToken: 'token' });
  });
});
