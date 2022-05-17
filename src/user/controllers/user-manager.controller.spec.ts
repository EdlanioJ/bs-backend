import { Test, TestingModule } from '@nestjs/testing';

import { UserManagerController } from './user-manager.controller';

import {
  AcceptManagerService,
  RejectManagerService,
  ListManagerRequestService,
  RequireManagerUserService,
} from '../services';
import { managerRequestStub } from '../../../test/stubs';
import { ManagerRequestModel } from '../models';
import { createResponse } from 'node-mocks-http';

jest.mock('../services');

const managerRequest = managerRequestStub();

describe('UserManagerController', () => {
  let controller: UserManagerController;
  let listManagerRequest: ListManagerRequestService;
  let acceptRequest: AcceptManagerService;
  let rejectRequest: RejectManagerService;
  let requireManager: RequireManagerUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserManagerController],
      providers: [
        AcceptManagerService,
        RejectManagerService,
        ListManagerRequestService,
        RequireManagerUserService,
      ],
    }).compile();

    controller = module.get<UserManagerController>(UserManagerController);
    listManagerRequest = module.get<ListManagerRequestService>(
      ListManagerRequestService,
    );
    acceptRequest = module.get<AcceptManagerService>(AcceptManagerService);
    rejectRequest = module.get<RejectManagerService>(RejectManagerService);
    requireManager = module.get<RequireManagerUserService>(
      RequireManagerUserService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('ListRequest', () => {
    it('should return list of manager requests', async () => {
      const result = {
        total: 1,
        data: ManagerRequestModel.mapCollection([managerRequest]),
      };
      const spy = jest
        .spyOn(listManagerRequest, 'execute')
        .mockResolvedValue(result);
      const res = createResponse();
      const limit = 10;
      const page = 1;
      await controller.listRequest(res);
      expect(spy).toHaveBeenCalledWith({ limit, page });
      expect(res.getHeader('x-total-count')).toBe(result.total);
      const body = res._getJSONData();
      expect(body).toHaveLength(result.data.length);
    });
  });

  describe('AcceptRequest', () => {
    it('should call accept manager service with correct values', async () => {
      const spy = jest.spyOn(acceptRequest, 'execute');
      await controller.accept('userId', 'requestId');
      expect(spy).toHaveBeenCalledWith({
        userId: 'userId',
        requestId: 'requestId',
      });
    });
  });

  describe('RejectRequest', () => {
    it('should call reject manager service with correct values', async () => {
      const spy = jest.spyOn(rejectRequest, 'execute');
      await controller.reject('userId', 'requestId', { reason: 'reason' });
      expect(spy).toHaveBeenCalledWith({
        userId: 'userId',
        requestId: 'requestId',
        reason: 'reason',
      });
    });
  });

  describe('RequireManager', () => {
    it('should call require manager service with correct values', async () => {
      const spy = jest.spyOn(requireManager, 'execute');
      await controller.require('userId');
      expect(spy).toHaveBeenCalledWith({ userId: 'userId' });
    });
  });
});
