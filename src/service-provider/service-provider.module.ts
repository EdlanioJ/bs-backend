import { Module } from '@nestjs/common';
import { ServiceProviderService } from './service-provider.service';
import { ServiceProviderController } from './service-provider.controller';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ServiceProviderRepository } from './service-provider.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserModule, PrismaModule, AuthModule],
  exports: [ServiceProviderRepository],
  providers: [ServiceProviderService, ServiceProviderRepository],
  controllers: [ServiceProviderController],
})
export class ServiceProviderModule {}
