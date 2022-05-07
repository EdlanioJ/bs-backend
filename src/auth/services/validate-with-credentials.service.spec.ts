import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../user/repositories';
import { AuthHelpers } from '../helpers';
import { ValidateWithCredentialsService } from './validate-with-credentials.service';

jest.mock('../../user/repositories');
jest.mock('../helpers');

describe('ValidateWithCredentialsService', () => {
  let service: ValidateWithCredentialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidateWithCredentialsService, UserRepository, AuthHelpers],
    }).compile();

    service = module.get<ValidateWithCredentialsService>(
      ValidateWithCredentialsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
