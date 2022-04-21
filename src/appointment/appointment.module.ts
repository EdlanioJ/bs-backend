import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentRepository } from './repository/appointment.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ServiceModule } from '../service/service.module';
import { UserRepository } from '../user/repository/user.repository';
import { CancelAppointmentService } from './services/cancel-appointment.service';
import { CompleteAppointmentService } from './services/complete-appointment.service';
import { CreateAppointmentService } from './services/create-appointment.service';
import { GetAppointmentService } from './services/get-appointment.service';
import { ListAppointmentService } from './services/list-appointment.service';
import { ListAppointmentByCustomerService } from './services/list-appointment-by-customer.service';
import { ListAppointmentByEmployeeService } from './services/list-appointment-by-employee.service';

@Module({
  controllers: [AppointmentController],
  providers: [
    AppointmentRepository,
    UserRepository,
    CancelAppointmentService,
    CompleteAppointmentService,
    CreateAppointmentService,
    GetAppointmentService,
    ListAppointmentService,
    ListAppointmentByCustomerService,
    ListAppointmentByEmployeeService,
  ],
  imports: [PrismaModule, AuthModule, ServiceModule],
})
export class AppointmentModule {}
