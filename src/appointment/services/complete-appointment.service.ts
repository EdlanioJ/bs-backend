import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import { isAfter } from 'date-fns';
import { AppointmentRepository } from '../repositories';

type Input = {
  userId: string;
  appointmentId: string;
};
@Injectable()
export class CompleteAppointmentService {
  constructor(private readonly appointmentRepo: AppointmentRepository) {}
  async execute({ appointmentId, userId }: Input): Promise<void> {
    const appointment = await this.appointmentRepo.findOne(appointmentId);
    if (!appointment) throw new UnauthorizedException('Appointment not found');

    if (appointment.employeeId !== userId)
      throw new UnauthorizedException('User is not the employee');

    if (appointment.status === 'COMPLETED')
      throw new BadRequestException('Appointment is already completed');

    if (appointment.status === 'CANCELLED')
      throw new BadRequestException('Appointment is cancelled');

    if (isAfter(appointment.start, new Date()))
      throw new BadRequestException('Appointment do not start yet');

    await this.appointmentRepo.update(appointmentId, {
      status: 'COMPLETED',
    });

    // notify customer
  }
}
