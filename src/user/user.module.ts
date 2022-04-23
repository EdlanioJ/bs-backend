import { Module } from '@nestjs/common';

import { UserManagerController } from './controllers/user-manager.controller';
import { ManagerRepository } from './repositories/manager.repository';
import { UserRepository } from './repositories/user.repository';
import { ManagerRequestRepository } from './repositories/manager-request.repository';
import { RequireManagerUserService } from './services/require-manager-user.service';
import { AcceptManagerService } from './services/accept-manager.service';
import { RejectManagerService } from './services/reject-manager.service';

import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, MailModule],
  providers: [
    RequireManagerUserService,
    AcceptManagerService,
    RejectManagerService,
    UserRepository,
    ManagerRepository,
    ManagerRequestRepository,
  ],
  controllers: [UserManagerController],
})
export class UserModule {}
