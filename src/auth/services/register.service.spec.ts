import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { userStub } from '../../../test/mocks/stubs';
import { SendMailProducerService } from '../../mail/services';
import { UserRepository } from '../../user/repositories';
import { AuthHelpers } from '../helpers';
import { RegisterService } from './register.service';

jest.mock('../../user/repositories');
jest.mock('../../mail/services');
jest.mock('../helpers');

describe('RegisterService', () => {
  let service: RegisterService;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        UserRepository,
        AuthHelpers,
        SendMailProducerService,
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
    userRepo = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if user already exists', async () => {
    const email = 'any_email';
    const name = 'any_name';
    const password = 'any_password';
    const user = userStub();
    user.email = email;

    const spy = jest
      .spyOn(userRepo, 'findOneByEmail')
      .mockResolvedValueOnce(user);

    const output = service.execute({ email, name, password });
    await expect(output).rejects.toThrowError(
      new BadRequestException('User already exists'),
    );
    expect(spy).toHaveBeenCalledWith(email);
  });
});
