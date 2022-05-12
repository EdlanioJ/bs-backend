import { Test } from '@nestjs/testing';
import { ValidateWithCredentialsService } from '../services';
import { LocalStrategy } from './local.strategy';

jest.mock('../services');

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let service: ValidateWithCredentialsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LocalStrategy, ValidateWithCredentialsService],
    }).compile();
    strategy = module.get<LocalStrategy>(LocalStrategy);
    service = module.get<ValidateWithCredentialsService>(
      ValidateWithCredentialsService,
    );
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate and return payload', async () => {
    const email = 'email';
    const password = 'password';
    const user = { id: 'id', username: 'username', role: 'role' };
    const spy = jest.spyOn(service, 'execute').mockResolvedValue(user);
    const result = await strategy.validate(email, password);
    expect(result).toEqual({ sub: 'id', username: 'username', role: 'role' });
    expect(spy).toHaveBeenCalledWith({ email, password });
  });
});
