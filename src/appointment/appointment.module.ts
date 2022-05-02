import { Module } from '@nestjs/common';

import { AuthModule } from '../auth';
import { ServiceRepository } from '../service/repositories';
import { UserRepository } from '../user/repositories';

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
  imports: [AuthModule],
})
export class AppointmentModule {}
