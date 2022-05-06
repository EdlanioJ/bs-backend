import { Test } from '@nestjs/testing';
import { SendMailProducerService } from '../../mail/services';
import { UserRepository } from '../../user/repositories';
import { ForgotPasswordService } from './forgot-password.service';

jest.mock('../../mail/services');
jest.mock('../../user/repositories');

describe('ForgotPasswordService', () => {
  let service: ForgotPasswordService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ForgotPasswordService,
        UserRepository,
        SendMailProducerService,
      ],
    }).compile();

    service = module.get<ForgotPasswordService>(ForgotPasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
