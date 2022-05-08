import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ServiceProviderRepository } from '../../service-provider/repositories';
import { ServiceRepository } from '../repositories';
import { CreateProviderServiceService } from './create-service.service';

jest.mock('../../service-provider/repositories');
jest.mock('../repositories');

describe('CreateProviderServiceService', () => {
  let service: CreateProviderServiceService;
  let providerRepo: ServiceProviderRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateProviderServiceService,
        ServiceProviderRepository,
        ServiceRepository,
      ],
    }).compile();
    service = module.get<CreateProviderServiceService>(
      CreateProviderServiceService,
    );
    providerRepo = module.get<ServiceProviderRepository>(
      ServiceProviderRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if user has no Provider', async () => {
    const userId = 'userId';
    const name = 'name';
    const appointmentDurationInMinutes = 1;
    const spy = jest
      .spyOn(providerRepo, 'findByUserId')
      .mockResolvedValue(null);
    const out = service.execute({
      appointmentDurationInMinutes,
      name,
      userId,
    });
    await expect(out).rejects.toThrow(
      new BadRequestException('User has no Provider'),
    );
    expect(spy).toHaveBeenCalledWith(userId);
  });
});
