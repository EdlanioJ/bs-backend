import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '../user/repositories/user.repository';

import { AppointmentController } from './controllers';
import { AppointmentRepository } from './repositories';
import {
  CancelAppointmentService,
  CompleteAppointmentService,
  CreateAppointmentService,
  GetAppointmentService,
  ListAppointmentByCustomerService,
  ListAppointmentByEmployeeService,
  ListAppointmentService,
} from './services';

import { ServiceRepository } from '../service/repositories';

@Module({
  controllers: [AppointmentController],
  providers: [
    AppointmentRepository,
    ServiceRepository,
    UserRepository,
    GetAppointmentService,
    ListAppointmentService,
    CancelAppointmentService,
    CreateAppointmentService,
    CompleteAppointmentService,
    ListAppointmentByEmployeeService,
    ListAppointmentByCustomerService,
  ],
  imports: [PrismaModule, AuthModule],
})
export class AppointmentModule {}
