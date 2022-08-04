import { Injectable } from '@nestjs/common';

import { AppointmentModel } from '../models';
import { AppointmentRepository } from '../repositories';

type Input = {
  page: number;
  limit: number;
  customerId: string;
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
export class ListAppointmentByCustomerService {
  constructor(private readonly appointmentRepo: AppointmentRepository) {}

  async execute({
    page,
    limit,
    customerId,
    fromDate,
    toDate,
    orderBy,
    sort,
    status,
  }: Input): Promise<Output> {
    const [total, appointments] = await Promise.all([
      this.appointmentRepo.count({
        where: {
          customerId,
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
          status: {
            in: status as any,
          },
          customerId,
          start: {
            gte: fromDate,
            lte: toDate,
          },
        },
      }),
    ]);
    return {
      total,
      data: AppointmentModel.mapCollection(appointments),
    };
  }
}
