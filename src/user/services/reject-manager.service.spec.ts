import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { managerRequestStub, userStub } from '../../../test/mocks/stubs';

import { SendMailProducerService } from '../../mail/services';
import { ManagerRequestRepository, UserRepository } from '../repositories';
import { RejectManagerService } from './reject-manager.service';

jest.mock('../../mail/services');
jest.mock('../repositories');

describe('RejectManagerService', () => {
  let service: RejectManagerService;
  let managerRequestRepo: ManagerRequestRepository;
  let userRepo: UserRepository;
  let mailProducer: SendMailProducerService;

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
    userRepo = module.get<UserRepository>(UserRepository);
    mailProducer = module.get<SendMailProducerService>(SendMailProducerService);
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

  it('should throw BadRequestException if manager request user not found', async () => {
    const managerRequest = managerRequestStub();
    jest
      .spyOn(managerRequestRepo, 'findAvailable')
      .mockResolvedValue(managerRequest);
    const spy = jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
    const out = service.execute({
      requestId: 'requestId',
      userId: 'userId',
      reason: 'reason',
    });
    await expect(out).rejects.toThrow(
      new BadRequestException('Manager request user not found'),
    );
    expect(spy).toHaveBeenCalledWith(managerRequest.userId);
  });

  it('should throw BadRequestException if user not found', async () => {
    const managerRequest = managerRequestStub();
    const user = userStub();
    jest
      .spyOn(managerRequestRepo, 'findAvailable')
      .mockResolvedValue(managerRequest);
    const spy = jest
      .spyOn(userRepo, 'findOne')
      .mockResolvedValueOnce(user)
      .mockResolvedValue(null);
    const out = service.execute({
      requestId: 'requestId',
      userId: 'userId',
      reason: 'reason',
    });
    await expect(out).rejects.toThrow(
      new BadRequestException('User not found'),
    );
    expect(spy).toHaveBeenNthCalledWith(2, 'userId');
  });

  it('should throw BadRequestException if not a valid user', async () => {
    const managerRequest = managerRequestStub();
    const user = userStub();
    user.role = 'USER';
    jest
      .spyOn(managerRequestRepo, 'findAvailable')
      .mockResolvedValue(managerRequest);
    jest
      .spyOn(userRepo, 'findOne')
      .mockResolvedValueOnce(user)
      .mockResolvedValue(user);
    const out = service.execute({
      requestId: 'requestId',
      userId: 'userId',
      reason: 'reason',
    });
    await expect(out).rejects.toThrow(
      new BadRequestException('Not a valid user'),
    );
  });

  it('should reject manager request', async () => {
    const managerRequest = managerRequestStub();
    const user = userStub();
    user.role = 'USER';
    const admin = userStub();
    admin.role = 'ADMIN';
    jest
      .spyOn(managerRequestRepo, 'findAvailable')
      .mockResolvedValue(managerRequest);
    jest
      .spyOn(userRepo, 'findOne')
      .mockResolvedValueOnce(user)
      .mockResolvedValue(admin);
    const sendMailSpy = jest.spyOn(mailProducer, 'execute');
    const spy = jest.spyOn(managerRequestRepo, 'update');
    await service.execute({
      requestId: 'requestId',
      userId: 'userId',
      reason: 'reason',
    });
    expect(spy).toHaveBeenCalledWith(managerRequest.id, {
      status: 'REJECTED',
      rejectBy: { connect: { id: admin.id } },
      rejectReason: 'reason',
    });
    expect(sendMailSpy).toHaveBeenCalledWith({
      to: user.email,
      type: 'manager-request-rejected',
      content: [
        {
          key: 'name',
          value: user.name,
        },
        {
          key: 'reason',
          value: 'reason',
        },
      ],
    });
  });
});
