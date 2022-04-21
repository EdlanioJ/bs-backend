import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { AppointmentRepository } from './appointment.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ServiceModule } from '../service/service.module';
import { UserRepository } from '../user/repository/user.repository';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService, AppointmentRepository, UserRepository],
  imports: [PrismaModule, AuthModule, ServiceModule],
})
export class AppointmentModule {}
