import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { userStub } from '../../../test/mocks/stubs';
import { UserRepository } from '../../user/repositories';
import { AuthHelpers } from '../helpers';
import { ValidateWithCredentialsService } from './validate-with-credentials.service';

jest.mock('../../user/repositories');
jest.mock('../helpers');

describe('ValidateWithCredentialsService', () => {
  let service: ValidateWithCredentialsService;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidateWithCredentialsService, UserRepository, AuthHelpers],
    }).compile();

    service = module.get<ValidateWithCredentialsService>(
      ValidateWithCredentialsService,
    );
    userRepo = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if user not found', async () => {
    const email = 'any_email';
    const password = 'any_password';

    const spy = jest.spyOn(userRepo, 'findOneByEmail').mockResolvedValue(null);

    const out = service.execute({ email, password });

    await expect(out).rejects.toThrowError(
      new BadRequestException('email or password is incorrect'),
    );
    expect(spy).toHaveBeenCalledWith(email);
  });

  it('should throw BadRequestException if user has no password', async () => {
    const email = 'any_email';
    const password = 'any_password';

    const user = userStub();
    user.password = null;

    const spy = jest.spyOn(userRepo, 'findOneByEmail').mockResolvedValue(user);

    const out = service.execute({ email, password });

    await expect(out).rejects.toThrowError(
      new BadRequestException('email or password is incorrect'),
    );
    expect(spy).toHaveBeenCalledWith(email);
  });
});
