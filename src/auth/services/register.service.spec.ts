import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { userStub } from '../../../test/stubs';
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
  let mailProducer: SendMailProducerService;
  let authHelpers: AuthHelpers;

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
    mailProducer = module.get<SendMailProducerService>(SendMailProducerService);
    authHelpers = module.get<AuthHelpers>(AuthHelpers);
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

  it('should create a new user', async () => {
    const email = 'any_email';
    const name = 'any_name';
    const password = 'any_password';
    const user = userStub();

    const findSpy = jest
      .spyOn(userRepo, 'findOneByEmail')
      .mockResolvedValueOnce(null);
    const createSpy = jest
      .spyOn(userRepo, 'create')
      .mockResolvedValueOnce(user);
    const sendMailSpy = jest.spyOn(mailProducer, 'execute');
    const hashSpy = jest
      .spyOn(authHelpers, 'hashData')
      .mockResolvedValueOnce('any_hash');

    await service.execute({ email, name, password });
    expect(findSpy).toHaveBeenCalledWith(email);
    expect(createSpy).toHaveBeenCalledWith({
      email,
      name,
      password: 'any_hash',
      avatar: 'default.png',
    });
    expect(sendMailSpy).toHaveBeenCalledWith(
      {
        to: email,
        type: 'welcome-email',
        content: [
          {
            key: 'name',
            value: name,
          },
        ],
      },
      { attempts: 3 },
    );
    expect(hashSpy).toHaveBeenCalledWith(password);
  });
});
