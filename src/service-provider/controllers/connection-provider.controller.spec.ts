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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
