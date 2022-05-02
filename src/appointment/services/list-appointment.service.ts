import { Injectable } from '@nestjs/common';

import { AppointmentModel } from '../models';
import { AppointmentRepository } from '../repositories';

type Input = {
  page: number;
  limit: number;
};

type Output = {
  total: number;
  data: AppointmentModel[];
};

@Injectable()
export class ListAppointmentService {
  constructor(private readonly appointmentRepo: AppointmentRepository) {}

  async execute({ page, limit }: Input): Promise<Output> {
    const [total, appointments] = await Promise.all([
      this.appointmentRepo.count(),
      this.appointmentRepo.findAll({
        skip: Number((page - 1) * limit),
        take: Number(limit),
      }),
    ]);

    return {
      data: AppointmentModel.mapCollection(appointments),
      total,
    };
  }
}
