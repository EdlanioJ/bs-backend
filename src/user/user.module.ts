import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { ManagerRequestRepository } from './repository/manager-request.repository';
import { RequireManagerUserService } from './services/require-manager-user.service';
import { AcceptManagerService } from './services/accept-manager.service';
import { MailModule } from '../mail/mail.module';
import { ManagerRepository } from './repository/manager.repository';
import { RejectManagerService } from './services/reject-manager.service';

@Module({
  imports: [PrismaModule, AuthModule, MailModule],
  providers: [
    RequireManagerUserService,
    AcceptManagerService,
    RejectManagerService,
    UserRepository,
    ManagerRepository,
    ManagerRequestRepository,
    UserService,
  ],
  exports: [UserRepository],
  controllers: [UserController],
})
export class UserModule {}
