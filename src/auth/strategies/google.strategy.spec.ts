import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { mockedConfigService } from '../../../test/mocks/services';
import { ValidateOAuthService } from '../services';
import { GoogleStrategy } from './google.strategy';

jest.mock('../services');

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        ValidateOAuthService,
        { provide: ConfigService, useValue: mockedConfigService },
      ],
    }).compile();
    strategy = module.get<GoogleStrategy>(GoogleStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });
});
