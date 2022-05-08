import { Test } from '@nestjs/testing';
import { ServiceProviderRepository } from '../../service-provider/repositories';
import { ServiceRepository } from '../repositories';
import { CreateProviderServiceService } from './create-service.service';

jest.mock('../../service-provider/repositories');
jest.mock('../repositories');

describe('CreateProviderServiceService', () => {
  let service: CreateProviderServiceService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
