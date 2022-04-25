import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma';
import { ServiceController } from './controllers';
import { ServiceRepository } from './repositories';
import { UserRepository } from '../user/repositories';
import { ServiceProviderRepository } from '../service-provider/repositories';
import {
  CreateProviderServiceService,
  GetProviderServiceService,
  ListProviderServiceService,
} from './services';

@Module({
  imports: [PrismaModule],
  exports: [ServiceRepository],
  controllers: [ServiceController],
  providers: [
    CreateProviderServiceService,
    ListProviderServiceService,
    GetProviderServiceService,
    UserRepository,
    ServiceRepository,
    ServiceProviderRepository,
  ],
})
export class ServiceModule {}
