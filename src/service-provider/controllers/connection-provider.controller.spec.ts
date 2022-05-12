import { Test, TestingModule } from '@nestjs/testing';
import { createResponse } from 'node-mocks-http';
import { providerConnectionStub } from '../../../test/mocks/stubs';
import { ProviderConnectionModel } from '../models';
import {
  AcceptConnectionService,
  DeleteConnectionService,
  ListConnectionByManagerService,
  ListConnectionService,
  RejectConnectionService,
  RequireConnectionService,
} from '../services';
import { ConnectionProviderController } from './connection-provider.controller';

jest.mock('../services');

const connectionProvider = providerConnectionStub();

const listResult = {
  total: 1,
  data: ProviderConnectionModel.mapCollection([connectionProvider]),
};

describe('ConnectionProviderController', () => {
  let controller: ConnectionProviderController;
  let acceptConnection: AcceptConnectionService;
  let rejectConnection: RejectConnectionService;
  let deleteConnection: DeleteConnectionService;
  let requireConnection: RequireConnectionService;
  let listConnection: ListConnectionService;
  let listConnectionByManager: ListConnectionByManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConnectionProviderController],
      providers: [
        AcceptConnectionService,
        DeleteConnectionService,
        ListConnectionByManagerService,
        ListConnectionService,
        RejectConnectionService,
        RequireConnectionService,
      ],
    }).compile();

    controller = module.get<ConnectionProviderController>(
      ConnectionProviderController,
    );
    acceptConnection = module.get<AcceptConnectionService>(
      AcceptConnectionService,
    );
    rejectConnection = module.get<RejectConnectionService>(
      RejectConnectionService,
    );
    deleteConnection = module.get<DeleteConnectionService>(
      DeleteConnectionService,
    );
    requireConnection = module.get<RequireConnectionService>(
      RequireConnectionService,
    );
    listConnection = module.get<ListConnectionService>(ListConnectionService);
    listConnectionByManager = module.get<ListConnectionByManagerService>(
      ListConnectionByManagerService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('accept connection', () => {
    it('should call accept connection service with correct values', async () => {
      const userId = 'userId';
      const requestId = 'requestId';
      const spy = jest.spyOn(acceptConnection, 'execute');
      await controller.accept(userId, requestId);
      expect(spy).toHaveBeenCalledWith({ userId, requestId });
    });
  });

  describe('reject connection', () => {
    it('should call reject connection service with correct values', async () => {
      const userId = 'userId';
      const requestId = 'requestId';
      const spy = jest.spyOn(rejectConnection, 'execute');
      await controller.reject(userId, requestId);
      expect(spy).toHaveBeenCalledWith({ userId, requestId });
    });
  });

  describe('delete connection', () => {
    it('should call delete connection service with correct values', async () => {
      const userId = 'userId';
      const connectionId = 'connectionId';
      const spy = jest.spyOn(deleteConnection, 'execute');
      await controller.delete(userId, connectionId);
      expect(spy).toHaveBeenCalledWith({ userId, connectionId });
    });
  });

  describe('require connection', () => {
    it('should call require connection service with correct values', async () => {
      const providerOwnerId = 'providerOwnerId';
      const userToConnectId = 'userToConnectId';
      const spy = jest.spyOn(requireConnection, 'execute');
      await controller.request(providerOwnerId, userToConnectId);
      expect(spy).toHaveBeenCalledWith({ providerOwnerId, userToConnectId });
    });
  });

  describe('list connection', () => {
    it('should list connection service return ProviderConnectionModel list and total', async () => {
      const page = 1;
      const limit = 10;
      const res = createResponse();
      const spy = jest
        .spyOn(listConnection, 'execute')
        .mockResolvedValue(listResult);
      await controller.list(res);
      expect(spy).toHaveBeenCalledWith({ page, limit });
      expect(res.getHeader('x-total-count')).toBe(listResult.total);
      const body = res._getJSONData();
      expect(body).toHaveLength(listResult.data.length);
    });
  });

  describe('list connection by manager', () => {
    it('should list connection by manager service return ProviderConnectionModel list and total', async () => {
      const page = 1;
      const limit = 10;
      const userId = 'userId';
      const res = createResponse();
      const spy = jest
        .spyOn(listConnectionByManager, 'execute')
        .mockResolvedValue(listResult);
      await controller.listByManager(res, userId);
      expect(spy).toHaveBeenCalledWith({ userId, page, limit });
      expect(res.getHeader('x-total-count')).toBe(listResult.total);
      const body = res._getJSONData();
      expect(body).toHaveLength(listResult.data.length);
    });
  });
});
