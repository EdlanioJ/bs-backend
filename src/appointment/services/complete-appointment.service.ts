import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import { isBefore } from 'date-fns';

import { AppointmentRepository } from '../repository/appointment.repository';
@Injectable()
export class CompleteAppointmentService {
  constructor(private readonly appointmentRepo: AppointmentRepository) {}
  async execute({
    appointmentId,
    userId,
  }: {
    userId: string;
    appointmentId: string;
  }) {
    const appointment = await this.appointmentRepo.findOne(appointmentId);
    if (!appointment) throw new UnauthorizedException('Appointment not found');

    if (appointment.employeeId !== userId)
      throw new UnauthorizedException('User is not the employee');

    if (appointment.status === 'COMPLETED')
      throw new BadRequestException('Appointment is already completed');

    if (appointment.status === 'CANCELLED')
      throw new BadRequestException('Appointment is cancelled');

    if (isBefore(appointment.start, new Date()))
      throw new BadRequestException('Appointment cannot be in the past');

    await this.appointmentRepo.update(appointmentId, {
      status: 'COMPLETED',
    });

    // notify customer
  }
}
