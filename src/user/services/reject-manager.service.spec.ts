import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { SendMailProducerService } from '../../mail/services';
import { ManagerRequestRepository, UserRepository } from '../repositories';
import { RejectManagerService } from './reject-manager.service';

jest.mock('../../mail/services');
jest.mock('../repositories');

describe('RejectManagerService', () => {
  let service: RejectManagerService;
  let managerRequestRepo: ManagerRequestRepository;

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
    managerRequestRepo = module.get<ManagerRequestRepository>(
      ManagerRequestRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if no request found', async () => {
    const spy = jest
      .spyOn(managerRequestRepo, 'findAvailable')
      .mockResolvedValue(null);
    const out = service.execute({
      requestId: 'requestId',
      userId: 'userId',
      reason: 'reason',
    });
    await expect(out).rejects.toThrow(
      new BadRequestException('No request found'),
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('requestId');
  });
});
