import { Test } from '@nestjs/testing';
import { UserRepository } from '../repositories';
import { GetUserService } from './get-user.service';

jest.mock('../repositories');

describe('GetUserService', () => {
  let service: GetUserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetUserService, UserRepository],
    }).compile();

    service = module.get<GetUserService>(GetUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
