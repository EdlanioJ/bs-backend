import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { userStub } from '../../../test/mocks/stubs';
import { ManagerRequestRepository, UserRepository } from '../repositories';
import { RequireManagerUserService } from './require-manager-user.service';

jest.mock('../repositories');

describe('RequireManagerUserService', () => {
  let service: RequireManagerUserService;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RequireManagerUserService,
        UserRepository,
        ManagerRequestRepository,
      ],
    }).compile();
    service = module.get<RequireManagerUserService>(RequireManagerUserService);
    userRepo = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if user not found', async () => {
    const userId = 'userId';
    const spy = jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
    const out = service.execute({ userId });
    await expect(out).rejects.toThrow(
      new BadRequestException('User not found'),
    );
    expect(spy).toHaveBeenCalledWith(userId);
  });

  it('should throw BadRequestException if invalid user', async () => {
    const userId = 'userId';
    const user = userStub();
    user.role = 'ADMIN';
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    const out = service.execute({ userId });
    await expect(out).rejects.toThrow(new BadRequestException('Invalid user'));
  });
});
