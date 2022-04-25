import { Test, TestingModule } from '@nestjs/testing';

import { UserManagerController } from './user-manager.controller';

import {
  AcceptManagerService,
  RejectManagerService,
  RequireManagerUserService,
} from '../services';

jest.mock('../services');

describe('UserManagerController', () => {
  let controller: UserManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserManagerController],
      providers: [
        AcceptManagerService,
        RejectManagerService,
        RequireManagerUserService,
      ],
    }).compile();

    controller = module.get<UserManagerController>(UserManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
