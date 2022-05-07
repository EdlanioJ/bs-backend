import { Test, TestingModule } from '@nestjs/testing';
import { SendMailProducerService } from '../../mail/services';
import { UserRepository } from '../../user/repositories';
import { ValidateOAuthService } from './validate-oauth.service';

jest.mock('../../mail/services');
jest.mock('../../user/repositories');

describe('ValidateOAuthService', () => {
  let service: ValidateOAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateOAuthService,
        UserRepository,
        SendMailProducerService,
      ],
    }).compile();

    service = module.get<ValidateOAuthService>(ValidateOAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
