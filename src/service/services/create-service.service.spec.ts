import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { serviceProviderStub } from '../../../test/mocks/stubs';
import { ServiceProviderRepository } from '../../service-provider/repositories';
import { ServiceRepository } from '../repositories';
import { CreateProviderServiceService } from './create-service.service';

jest.mock('../../service-provider/repositories');
jest.mock('../repositories');

describe('CreateProviderServiceService', () => {
  let service: CreateProviderServiceService;
  let providerRepo: ServiceProviderRepository;
  let serviceRepo: ServiceRepository;

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
    serviceRepo = module.get<ServiceRepository>(ServiceRepository);
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

  it('should create a service', async () => {
    const userId = 'userId';
    const name = 'name';
    const serviceProvider = serviceProviderStub();
    const appointmentDurationInMinutes = 1;
    const spy = jest
      .spyOn(providerRepo, 'findByUserId')
      .mockResolvedValue(serviceProvider);
    const spy2 = jest.spyOn(serviceRepo, 'create');
    await service.execute({
      appointmentDurationInMinutes,
      name,
      userId,
    });
    expect(spy).toHaveBeenCalledWith(userId);
    expect(spy2).toHaveBeenCalledWith({
      name,
      provider: { connect: { id: serviceProvider.id } },
      appointmentDurationInMinutes,
    });
  });
});
