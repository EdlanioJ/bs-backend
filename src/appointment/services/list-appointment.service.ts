import { Injectable } from '@nestjs/common';
import { AppointmentModel } from '../models/appointment.models';

import { AppointmentRepository } from '../repositories';

type Input = {
  page: number;
  limit: number;
};

type Output = {
  total: number;
  page: number;
  limit: number;
  data: AppointmentModel[];
};
@Injectable()
export class ListAppointmentService {
  constructor(private readonly appointmentRepo: AppointmentRepository) {}

  async execute({ page = 1, limit = 10 }: Input): Promise<Output> {
    const [total, appointments] = await Promise.all([
      this.appointmentRepo.count(),
      this.appointmentRepo.findAll({
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: AppointmentModel.mapCollection(appointments),
      total,
      page,
      limit,
    };
  }
}
