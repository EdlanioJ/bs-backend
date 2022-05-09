import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserRepository } from '../../user/repositories';
import { ServiceProviderRepository } from '../repositories';
import { AddServiceProviderService } from './add-service-provider.service';

jest.mock('../../user/repositories');
jest.mock('../repositories');

describe('AddServiceProviderService', () => {
  let service: AddServiceProviderService;
  let userRepo: UserRepository;

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
});
