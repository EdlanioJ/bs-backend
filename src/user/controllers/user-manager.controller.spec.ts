import { Test, TestingModule } from '@nestjs/testing';

import { UserManagerController } from './user-manager.controller';

import { AcceptManagerService } from '../services/accept-manager.service';
import { RejectManagerService } from '../services/reject-manager.service';
import { RequireManagerUserService } from '../services/require-manager-user.service';

jest.mock('../services/accept-manager.service');
jest.mock('../services/reject-manager.service');
jest.mock('../services/require-manager-user.service');

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
