import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

import {
  ConnectionProviderController,
  ServiceProviderController,
} from './controllers';

import {
  ProviderConnectionRepository,
  RequestConnectionRepository,
  ServiceProviderRepository,
} from './repositories';

import {
  ListConnectionByManagerService,
  DeleteServiceProviderService,
  AddServiceProviderService,
  GetServiceProviderService,
  RequireConnectionService,
  AcceptConnectionService,
  DeleteConnectionService,
  RejectConnectionService,
  ListConnectionService,
} from './services';

import { UserRepository } from '../user/repositories/user.repository';
@Module({
  imports: [PrismaModule, AuthModule, MailModule],
  providers: [
    ListConnectionByManagerService,
    DeleteServiceProviderService,
    AddServiceProviderService,
    GetServiceProviderService,
    RequireConnectionService,
    AcceptConnectionService,
    DeleteConnectionService,
    RejectConnectionService,
    ListConnectionService,
    ProviderConnectionRepository,
    RequestConnectionRepository,
    ServiceProviderRepository,
    UserRepository,
  ],
  controllers: [ServiceProviderController, ConnectionProviderController],
})
export class ServiceProviderModule {}
