import { Module } from '@nestjs/common';

import { AuthModule } from '../auth';
import { MailModule } from '../mail';

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

import { UserRepository } from '../user/repositories';

@Module({
  imports: [AuthModule, MailModule],
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
