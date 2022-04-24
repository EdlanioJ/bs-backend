import { Injectable } from '@nestjs/common';
import { AppointmentModel } from '../models/appointment.models';
import { AppointmentRepository } from '../repositories';

type Input = {
  page: number;
  limit: number;
  employeeId: string;
  fromDate?: Date;
  toDate?: Date;
};

type Output = {
  total: number;
  page: number;
  limit: number;
  data: AppointmentModel[];
};

@Injectable()
export class ListAppointmentByEmployeeService {
  constructor(private readonly appointmentRepo: AppointmentRepository) {}

  async execute({
    page = 1,
    limit = 10,
    employeeId,
    fromDate,
    toDate,
  }: Input): Promise<Output> {
    const [total, appointments] = await Promise.all([
      this.appointmentRepo.count({
        where: {
          employeeId,
          start: {
            gte: fromDate,
            lte: toDate,
          },
        },
      }),
      this.appointmentRepo.findAll({
        take: limit,
        skip: (page - 1) * limit,
        where: {
          employeeId,
          start: {
            gte: fromDate,
            lte: toDate,
          },
        },
      }),
    ]);

    return {
      data: AppointmentModel.mapCollection(appointments),
      limit,
      page,
      total,
    };
  }
}
