import { Module } from '@nestjs/common';
import { ServiceProviderService } from './service-provider.service';
import { ServiceProviderController } from './service-provider.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RequireConnectionService } from './services/require-connection.service';
import { RequestConnectionRepository } from './repositories/request-connection.repository';
import { MailModule } from '../mail/mail.module';
import { AcceptConnectionService } from './services/accept-connection.service';
import { ProviderConnectionRepository } from './repositories/provider-connection.repository';
import { RejectConnectionService } from './services/reject-connection';
import { DeleteConnectionService } from './services/delete-connection.service';
import { ListConnectionByManagerService } from './services/list-connection-by-manager.service';
import { ListConnectionService } from './services/list-connection.service';
import { ServiceProviderRepository } from './service-provider.repository';
import { UserRepository } from 'src/user/repositories/user.repository';

@Module({
  imports: [PrismaModule, AuthModule, MailModule],
  exports: [ServiceProviderRepository],
  providers: [
    ServiceProviderService,
    ListConnectionByManagerService,
    ListConnectionService,
    ServiceProviderRepository,
    AcceptConnectionService,
    RequireConnectionService,
    DeleteConnectionService,
    ProviderConnectionRepository,
    RejectConnectionService,
    RequestConnectionRepository,
    UserRepository,
  ],
  controllers: [ServiceProviderController],
})
export class ServiceProviderModule {}
