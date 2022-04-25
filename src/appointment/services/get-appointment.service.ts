import { Injectable } from '@nestjs/common';

import { AppointmentModel } from '../models';
import { AppointmentRepository } from '../repositories';

type Input = {
  id: string;
};

type Output = AppointmentModel;

@Injectable()
export class GetAppointmentService {
  constructor(private readonly appointmentRepo: AppointmentRepository) {}

  async execute({ id }: Input): Promise<Output> {
    const appointment = await this.appointmentRepo.findOne(id);
    return AppointmentModel.map(appointment);
  }
}
