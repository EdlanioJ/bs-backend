import { Test } from '@nestjs/testing';
import { ValidateWithCredentialsService } from '../services';
import { LocalStrategy } from './local.strategy';

jest.mock('../services');

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LocalStrategy, ValidateWithCredentialsService],
    }).compile();
    strategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });
});
