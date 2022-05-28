import { Test } from '@nestjs/testing';
import {
  ManagerRepository,
  ManagerRequestRepository,
  UserRepository,
} from '../repositories';
import { SendMailProducerService } from '../../mail/services';
import { AcceptManagerService } from './accept-manager.service';
import { BadRequestException } from '@nestjs/common';
import { managerRequestStub, userStub } from '../../../test/stubs';

jest.mock('../repositories');
jest.mock('../../mail/services');

describe('AcceptManagerService', () => {
  let service: AcceptManagerService;
  let managerRequestRepo: ManagerRequestRepository;
  let userRepo: UserRepository;
  let managerRepo: ManagerRepository;
  let mailProducer: SendMailProducerService;

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
    managerRepo = module.get<ManagerRepository>(ManagerRepository);
    mailProducer = module.get<SendMailProducerService>(SendMailProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if no request found', async () => {
    const spy = jest
      .spyOn(managerRequestRepo, 'findOne')
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
    jest.spyOn(managerRequestRepo, 'findOne').mockResolvedValue(managerRequest);
    const spy = jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
    const out = service.execute({ requestId: 'requestId', userId: 'userId' });
    await expect(out).rejects.toThrow(
      new BadRequestException('Manager request user not found'),
    );
    expect(spy).toHaveBeenCalledWith(managerRequest.userId);
  });

  it('should throw BadRequestException if invalid manager request user', async () => {
    const managerRequest = managerRequestStub();
    managerRequest.status = 'PENDING';
    const user = userStub();
    user.role = 'MANAGER';
    jest.spyOn(managerRequestRepo, 'findOne').mockResolvedValue(managerRequest);
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    const out = service.execute({ requestId: 'requestId', userId: 'userId' });
    await expect(out).rejects.toThrow(
      new BadRequestException('Invalid manager request user'),
    );
  });

  it('should throw BadRequestException if user not found', async () => {
    const managerRequest = managerRequestStub();
    managerRequest.status = 'PENDING';
    const user = userStub();
    user.role = 'USER';
    jest.spyOn(managerRequestRepo, 'findOne').mockResolvedValue(managerRequest);
    const spy = jest
      .spyOn(userRepo, 'findOne')
      .mockResolvedValueOnce(user)
      .mockResolvedValue(null);
    const out = service.execute({ requestId: 'requestId', userId: 'userId' });
    await expect(out).rejects.toThrow(
      new BadRequestException('User not found'),
    );
    expect(spy).toHaveBeenNthCalledWith(2, 'userId');
  });

  it('should throw BadRequestException if not a valid user', async () => {
    const managerRequest = managerRequestStub();
    managerRequest.status = 'PENDING';
    const user = userStub();
    user.role = 'USER';
    jest.spyOn(managerRequestRepo, 'findOne').mockResolvedValue(managerRequest);
    jest
      .spyOn(userRepo, 'findOne')
      .mockResolvedValueOnce(user)
      .mockResolvedValue(user);
    const out = service.execute({ requestId: 'requestId', userId: 'userId' });
    await expect(out).rejects.toThrow(
      new BadRequestException('Not a valid user'),
    );
  });

  it('should accept manager request', async () => {
    const managerRequest = managerRequestStub();
    managerRequest.status = 'PENDING';
    const user = userStub();
    user.role = 'USER';
    const admin = userStub();
    admin.role = 'ADMIN';
    jest.spyOn(managerRequestRepo, 'findOne').mockResolvedValue(managerRequest);
    jest
      .spyOn(userRepo, 'findOne')
      .mockResolvedValueOnce(user)
      .mockResolvedValue(admin);
    const createManagerSpy = jest.spyOn(managerRepo, 'create');
    const updateUserSpy = jest.spyOn(userRepo, 'update');
    const sendMailSpy = jest.spyOn(mailProducer, 'execute');
    const updateManagerRequestSpy = jest.spyOn(managerRequestRepo, 'update');
    await service.execute({ requestId: 'requestId', userId: 'userId' });
    expect(createManagerSpy).toHaveBeenCalledWith({
      user: { connect: { id: user.id } },
      authorizedBy: { connect: { id: admin.id } },
    });
    expect(updateUserSpy).toHaveBeenCalledWith(user.id, { role: 'MANAGER' });
    expect(updateManagerRequestSpy).toHaveBeenCalledWith(managerRequest.id, {
      status: 'ACCEPTED',
    });
    expect(sendMailSpy).toHaveBeenCalledWith({
      to: user.email,
      type: 'manager-request-accepted',
      content: [
        {
          key: 'name',
          value: user.name,
        },
      ],
    });
  });
});
