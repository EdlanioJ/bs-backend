import { Injectable } from '@nestjs/common';
import { AppointmentModel } from '../models';
import { AppointmentRepository } from '../repositories';

type Input = {
  page: number;
  limit: number;
  employeeId: string;
  fromDate?: Date;
  toDate?: Date;
  orderBy?: string;
  sort?: string;
  status?: string[];
};

type Output = {
  total: number;
  data: AppointmentModel[];
};

@Injectable()
export class ListAppointmentByEmployeeService {
  constructor(private readonly appointmentRepo: AppointmentRepository) {}

  async execute({
    page,
    limit,
    employeeId,
    fromDate,
    toDate,
    orderBy,
    sort,
    status,
  }: Input): Promise<Output> {
    const [total, appointments] = await Promise.all([
      this.appointmentRepo.count({
        where: {
          employeeId,
          status: {
            in: status as any,
          },
          start: {
            gte: fromDate,
            lte: toDate,
          },
        },
      }),
      this.appointmentRepo.findAll({
        skip: Number((page - 1) * limit),
        take: Number(limit),
        orderBy: {
          [orderBy]: sort,
        },
        where: {
          employeeId,
          status: {
            in: status as any,
          },
          start: {
            gte: fromDate,
            lte: toDate,
          },
        },
      }),
    ]);

    return {
      data: AppointmentModel.mapCollection(appointments),
      total,
    };
  }
}
