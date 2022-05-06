import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../user/repositories';
import { AuthHelpers } from '../helpers';
import { LoginService } from './login.service';

jest.mock('../helpers');
jest.mock('../../user/repositories');

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginService, UserRepository, AuthHelpers],
    }).compile();

    service = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
