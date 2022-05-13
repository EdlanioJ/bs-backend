import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { userStub, managerRequestStub } from '../../../test/stubs';
import { ManagerRequestRepository, UserRepository } from '../repositories';
import { RequireManagerUserService } from './require-manager-user.service';

jest.mock('../repositories');

describe('RequireManagerUserService', () => {
  let service: RequireManagerUserService;
  let userRepo: UserRepository;
  let managerRequestRepo: ManagerRequestRepository;

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
    managerRequestRepo = module.get<ManagerRequestRepository>(
      ManagerRequestRepository,
    );
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

  it('should throw BadRequestException if request already sent', async () => {
    const userId = 'userId';
    const user = userStub();
    user.role = 'USER';
    const managerRequest = managerRequestStub();
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    const spy = jest
      .spyOn(managerRequestRepo, 'findAvailable')
      .mockResolvedValue(managerRequest);
    const out = service.execute({ userId });
    await expect(out).rejects.toThrow(
      new BadRequestException('Request already sent'),
    );
    expect(spy).toHaveBeenCalledWith(userId);
  });

  it('should require manager', async () => {
    const userId = 'userId';
    const user = userStub();
    user.role = 'USER';
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    jest.spyOn(managerRequestRepo, 'findAvailable').mockResolvedValue(null);
    const spy = jest.spyOn(managerRequestRepo, 'create');
    await service.execute({ userId });
    expect(spy).toHaveBeenCalledWith({
      user: { connect: { id: user.id } },
    });
  });
});
