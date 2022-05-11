import { Test } from '@nestjs/testing';
import {
  ManagerRepository,
  ManagerRequestRepository,
  UserRepository,
} from '../repositories';
import { SendMailProducerService } from '../../mail/services';
import { AcceptManagerService } from './accept-manager.service';
import { BadRequestException } from '@nestjs/common';
import { managerRequestStub } from '../../../test/mocks/stubs';

jest.mock('../repositories');
jest.mock('../../mail/services');

describe('AcceptManagerService', () => {
  let service: AcceptManagerService;
  let managerRequestRepo: ManagerRequestRepository;
  let userRepo: UserRepository;

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
    userRepo = module.get<UserRepository>(UserRepository);
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

  it('should throw BadRequestException if manager request user not found', async () => {
    const managerRequest = managerRequestStub();
    jest
      .spyOn(managerRequestRepo, 'findAvailable')
      .mockResolvedValue(managerRequest);
    const spy = jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
    const out = service.execute({ requestId: 'requestId', userId: 'userId' });
    await expect(out).rejects.toThrow(
      new BadRequestException('Manager request user not found'),
    );
    expect(spy).toHaveBeenCalledWith(managerRequest.userId);
  });
});
