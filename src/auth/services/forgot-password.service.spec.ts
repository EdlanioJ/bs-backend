import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { userStub } from '../../../test/mocks/stubs';
import { SendMailProducerService } from '../../mail/services';
import { UserRepository } from '../../user/repositories';
import { ForgotPasswordService } from './forgot-password.service';

jest.mock('../../mail/services');
jest.mock('../../user/repositories');

describe('ForgotPasswordService', () => {
  let service: ForgotPasswordService;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ForgotPasswordService,
        UserRepository,
        SendMailProducerService,
      ],
    }).compile();

    service = module.get<ForgotPasswordService>(ForgotPasswordService);
    userRepo = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if userRepo.findOneByEmail return null', async () => {
    const email = 'any_email';
    const spy = jest
      .spyOn(userRepo, 'findOneByEmail')
      .mockResolvedValueOnce(null);
    const output = service.execute({ email });

    expect(output).rejects.toThrow(new BadRequestException('User not found'));
    expect(spy).toHaveBeenCalledWith(email);
  });

  it('should call userRepo.update with correct params', async () => {
    const email = 'any_email';
    const user = userStub();
    const findSpy = jest
      .spyOn(userRepo, 'findOneByEmail')
      .mockResolvedValueOnce(user);
    const updateSpy = jest.spyOn(userRepo, 'update');
    await service.execute({ email });
    expect(findSpy).toHaveBeenCalledWith(email);
    expect(updateSpy).toHaveBeenCalledWith(user.id, {
      resetPasswordExpires: expect.any(Date),
      resetPasswordToken: expect.any(String),
    });
  });
});
