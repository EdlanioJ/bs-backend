import { Module } from '@nestjs/common';

import { UserController, UserManagerController } from './controllers';
import {
  ManagerRepository,
  ManagerRequestRepository,
  UserRepository,
} from './repositories';

import {
  AcceptManagerService,
  ListManagerRequestService,
  RejectManagerService,
  RequireManagerUserService,
  GetUserService,
} from './services';

import { AuthModule } from '../auth';
import { MailModule } from '../mail';

@Module({
  imports: [AuthModule, MailModule],
  providers: [
    RequireManagerUserService,
    ListManagerRequestService,
    AcceptManagerService,
    RejectManagerService,
    GetUserService,
    UserRepository,
    ManagerRepository,
    ManagerRequestRepository,
  ],
  controllers: [UserManagerController, UserController],
})
export class UserModule {}
