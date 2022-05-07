import { Test, TestingModule } from '@nestjs/testing';
import { SendMailProducerService } from '../../mail/services';
import { UserRepository } from '../../user/repositories';
import { AuthHelpers } from '../helpers';
import { RegisterService } from './register.service';

jest.mock('../../user/repositories');
jest.mock('../../mail/services');
jest.mock('../helpers');

describe('RegisterService', () => {
  let service: RegisterService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
