import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { userStub } from '../../../test/mocks/stubs';
import { SendMailProducerService } from '../../mail/services';
import { UserRepository } from '../../user/repositories';
import { AuthHelpers } from '../helpers';
import { ResetPasswordService } from './reset-password.service';

jest.mock('../../user/repositories');
jest.mock('../../mail/services');
jest.mock('../helpers');

describe('ResetPasswordService', () => {
  let service: ResetPasswordService;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResetPasswordService,
        UserRepository,
        SendMailProducerService,
        AuthHelpers,
      ],
    }).compile();

    service = module.get<ResetPasswordService>(ResetPasswordService);
    userRepo = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if invalid token', async () => {
    const spy = jest
      .spyOn(userRepo, 'findOneByResetToken')
      .mockResolvedValueOnce(null);
    const token = 'token';
    const password = 'password';

    const out = service.execute({ token, password });

    expect(spy).toHaveBeenCalledWith(token);
    await expect(out).rejects.toThrowError(
      new BadRequestException('Invalid token'),
    );
  });

  it('should throw BadRequestException if token expired', async () => {
    const user = { ...userStub(), resetPasswordExpires: faker.date.past() };
    const spy = jest
      .spyOn(userRepo, 'findOneByResetToken')
      .mockResolvedValueOnce(user);
    const token = 'token';
    const password = 'password';

    const out = service.execute({ token, password });

    expect(spy).toHaveBeenCalledWith(token);
    await expect(out).rejects.toThrowError(
      new BadRequestException('Token expired'),
    );
  });
});
