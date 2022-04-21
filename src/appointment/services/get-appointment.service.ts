import { Injectable } from '@nestjs/common';
import { AppointmentRepository } from '../repository/appointment.repository';

@Injectable()
export class GetAppointmentService {
  constructor(private readonly appointmentRepo: AppointmentRepository) {}

  async execute(id: string) {
    return this.appointmentRepo.findOne(id);
  }
}
