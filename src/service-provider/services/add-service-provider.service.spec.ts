import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { userStub } from '../../../test/stubs';

import { UserRepository } from '../../user/repositories';
import { ServiceProviderRepository } from '../repositories';
import { AddServiceProviderService } from './add-service-provider.service';

jest.mock('../../user/repositories');
jest.mock('../repositories');

describe('AddServiceProviderService', () => {
  let service: AddServiceProviderService;
  let userRepo: UserRepository;
  let providerRepo: ServiceProviderRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AddServiceProviderService,
        ServiceProviderRepository,
        UserRepository,
      ],
    }).compile();
    service = module.get<AddServiceProviderService>(AddServiceProviderService);
    userRepo = module.get<UserRepository>(UserRepository);
    providerRepo = module.get<ServiceProviderRepository>(
      ServiceProviderRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw a BadRequestException if user not found', async () => {
    const userId = 'userId';
    const name = 'name';
    const spy = jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(null);
    const out = service.execute({ userId, name });
    await expect(out).rejects.toThrow(
      new BadRequestException('User not found'),
    );
    expect(spy).toHaveBeenCalledWith(userId);
  });

  it('should throw a BadRequestException if user is not a manager', async () => {
    const userId = 'userId';
    const name = 'name';
    const user = userStub();
    user.role = 'USER';
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);
    const out = service.execute({ userId, name });
    await expect(out).rejects.toThrow(
      new BadRequestException('User is not a manager'),
    );
  });

  it('should create a service provider', async () => {
    const userId = 'userId';
    const name = 'name';
    const user = userStub();
    user.role = 'MANAGER';
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);
    const spy = jest.spyOn(providerRepo, 'create');
    await service.execute({ userId, name });
    expect(spy).toHaveBeenCalledWith({
      user: { connect: { id: userId } },
      name,
    });
  });
});
