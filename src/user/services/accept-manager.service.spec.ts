import { Test } from '@nestjs/testing';
import {
  ManagerRepository,
  ManagerRequestRepository,
  UserRepository,
} from '../repositories';
import { SendMailProducerService } from '../../mail/services';
import { AcceptManagerService } from './accept-manager.service';
import { BadRequestException } from '@nestjs/common';

jest.mock('../repositories');
jest.mock('../../mail/services');

describe('AcceptManagerService', () => {
  let service: AcceptManagerService;
  let managerRequestRepo: ManagerRequestRepository;

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
    const out = service.execute({ requestId: 'requestId', userId: 'userId' });
    await expect(out).rejects.toThrow(
      new BadRequestException('No request found'),
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('requestId');
  });
});
