import { Test } from '@nestjs/testing';
import { ManagerRequestRepository, UserRepository } from '../repositories';
import { RequireManagerUserService } from './require-manager-user.service';

jest.mock('../repositories');

describe('RequireManagerUserService', () => {
  let service: RequireManagerUserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RequireManagerUserService,
        UserRepository,
        ManagerRequestRepository,
      ],
    }).compile();
    service = module.get<RequireManagerUserService>(RequireManagerUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
