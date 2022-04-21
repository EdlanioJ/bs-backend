import { Injectable } from '@nestjs/common';

import { AppointmentRepository } from '../repository/appointment.repository';

@Injectable()
export class ListAppointmentService {
  constructor(private readonly appointmentRepo: AppointmentRepository) {}

  async execute({ page, limit }: { page: number; limit: number }) {
    return await this.appointmentRepo.findAll({
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
