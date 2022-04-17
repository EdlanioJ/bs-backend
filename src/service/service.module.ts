import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { ServiceRepository } from './service.repository';
import { ServiceProviderModule } from 'src/service-provider/service-provider.module';

@Module({
  imports: [PrismaModule, UserModule, ServiceProviderModule],
  exports: [ServiceRepository],
  controllers: [ServiceController],
  providers: [ServiceService, ServiceRepository],
})
export class ServiceModule {}
