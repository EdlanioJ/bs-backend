import { Test } from '@nestjs/testing';
import { UserRepository } from '../../user/repositories';
import { ServiceProviderRepository } from '../repositories';
import { AddServiceProviderService } from './add-service-provider.service';

jest.mock('../../user/repositories');
jest.mock('../repositories');

describe('AddServiceProviderService', () => {
  let service: AddServiceProviderService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AddServiceProviderService,
        ServiceProviderRepository,
        UserRepository,
      ],
    }).compile();
    service = module.get<AddServiceProviderService>(AddServiceProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
