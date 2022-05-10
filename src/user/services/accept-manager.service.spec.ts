import { Test } from '@nestjs/testing';
import {
  ManagerRepository,
  ManagerRequestRepository,
  UserRepository,
} from '../repositories';
import { SendMailProducerService } from '../../mail/services';
import { AcceptManagerService } from './accept-manager.service';

jest.mock('../repositories');
jest.mock('../../mail/services');

describe('AcceptManagerService', () => {
  let service: AcceptManagerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AcceptManagerService,
        ManagerRepository,
        ManagerRequestRepository,
        UserRepository,
        SendMailProducerService,
      ],
    }).compile();

    service = module.get<AcceptManagerService>(AcceptManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
