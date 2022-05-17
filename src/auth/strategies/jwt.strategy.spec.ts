import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { mockedConfigService } from '../../../test/mocks/services';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockedConfigService },
      ],
    }).compile();
    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate and return payload', async () => {
    const payload = { sub: 'id', username: 'username', role: 'role' };
    const out = await strategy.validate(payload);
    expect(out).toEqual(payload);
  });
});
