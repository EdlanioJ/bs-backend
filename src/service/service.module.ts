import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ServiceRepository } from './service.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { ServiceProviderRepository } from '../service-provider/service-provider.repository';

@Module({
  imports: [PrismaModule],
  exports: [ServiceRepository],
  controllers: [ServiceController],
  providers: [
    ServiceService,
    ServiceRepository,
    UserRepository,
    ServiceProviderRepository,
  ],
})
export class ServiceModule {}
