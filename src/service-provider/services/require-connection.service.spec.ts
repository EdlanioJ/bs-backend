import { Test } from '@nestjs/testing';
import { RequireConnectionService } from './require-connection.service';
import { SendMailProducerService } from '../../mail/services';
import { UserRepository } from '../../user/repositories';
import {
  RequestConnectionRepository,
  ServiceProviderRepository,
} from '../repositories';

jest.mock('../repositories');
jest.mock('../../user/repositories');
jest.mock('../../mail/services');

describe('RequireConnectionService', () => {
  let service: RequireConnectionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RequireConnectionService,
        UserRepository,
        ServiceProviderRepository,
        RequestConnectionRepository,
        SendMailProducerService,
      ],
    }).compile();

    service = module.get<RequireConnectionService>(RequireConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
