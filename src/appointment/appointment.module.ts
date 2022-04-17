import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { AppointmentRepository } from './appointment.repository';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ServiceModule } from 'src/service/service.module';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService, AppointmentRepository],
  imports: [UserModule, PrismaModule, AuthModule, ServiceModule],
})
export class AppointmentModule {}
