import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AppointmentRepository } from '../repositories';

type Input = {
  appointmentId: string;
  userId: string;
  reason: string;
};

@Injectable()
export class CancelAppointmentService {
  constructor(private readonly appointmentRepo: AppointmentRepository) {}
  async execute({ appointmentId, userId, reason }: Input): Promise<void> {
    const appointment = await this.appointmentRepo.findOne(appointmentId);
    if (!appointment) throw new UnauthorizedException('Appointment not found');

    if (appointment.customerId !== userId)
      throw new UnauthorizedException('User is not the customer');

    if (appointment.status === 'CANCELLED')
      throw new BadRequestException('Appointment is already cancelled');

    if (appointment.status === 'COMPLETED')
      throw new BadRequestException('Appointment is already completed');

    await this.appointmentRepo.update(appointmentId, {
      canceled: new Date(),
      canceledReason: reason,
    });

    // notify employee
  }
}
