import { Test, TestingModule } from '@nestjs/testing';

import { UserManagerController } from './user-manager.controller';

import {
  AcceptManagerService,
  RejectManagerService,
  ListManagerRequestService,
  RequireManagerUserService,
} from '../services';
import { managerRequestStub } from '../../../test/mocks/stubs';
import { ManagerRequestModel } from '../models';
import { createResponse } from 'node-mocks-http';

jest.mock('../services');

const managerRequest = managerRequestStub();

describe('UserManagerController', () => {
  let controller: UserManagerController;
  let listManagerRequest: ListManagerRequestService;

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
      await controller.listRequest(page, limit, res);
      expect(spy).toHaveBeenCalledWith({ limit, page });
      expect(res.getHeader('x-total-count')).toBe(result.total);
      const body = res._getJSONData();
      expect(body).toHaveLength(result.data.length);
    });
  });
});
