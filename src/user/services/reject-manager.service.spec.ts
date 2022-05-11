import { Test } from '@nestjs/testing';

import { SendMailProducerService } from '../../mail/services';
import { ManagerRequestRepository, UserRepository } from '../repositories';
import { RejectManagerService } from './reject-manager.service';

jest.mock('../../mail/services');
jest.mock('../repositories');

describe('RejectManagerService', () => {
  let service: RejectManagerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RejectManagerService,
        UserRepository,
        ManagerRequestRepository,
        SendMailProducerService,
      ],
    }).compile();
    service = module.get<RejectManagerService>(RejectManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
