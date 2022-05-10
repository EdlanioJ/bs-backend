import { Test, TestingModule } from '@nestjs/testing';
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

describe('ConnectionProviderController', () => {
  let controller: ConnectionProviderController;
  let acceptConnection: AcceptConnectionService;
  let rejectConnection: RejectConnectionService;

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
});
