import { Test } from '@nestjs/testing';
import { SendMailProducerService } from '../../mail/services';
import { UserRepository } from '../../user/repositories';
import { AuthHelpers } from '../helpers';
import { ResetPasswordService } from './reset-password.service';

jest.mock('../../user/repositories');
jest.mock('../../mail/services');
jest.mock('../helpers');

describe('ResetPasswordService', () => {
  let service: ResetPasswordService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
