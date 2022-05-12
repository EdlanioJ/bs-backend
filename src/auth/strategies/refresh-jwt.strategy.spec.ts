import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { mockedConfigService } from '../../../test/mocks/services';
import { RefreshJwtStrategy } from './refresh-jwt.strategy';

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
});
