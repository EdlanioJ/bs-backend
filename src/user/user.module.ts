import { Module } from '@nestjs/common';

import { UserManagerController } from './controllers';
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
} from './services';

import { AuthModule } from '../auth';
import { MailModule } from '../mail';
import { PrismaModule } from '../prisma';

@Module({
  imports: [PrismaModule, AuthModule, MailModule],
  providers: [
    RequireManagerUserService,
    ListManagerRequestService,
    AcceptManagerService,
    RejectManagerService,
    UserRepository,
    ManagerRepository,
    ManagerRequestRepository,
  ],
  controllers: [UserManagerController],
})
export class UserModule {}
