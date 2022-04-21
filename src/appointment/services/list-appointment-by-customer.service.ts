import { Injectable } from '@nestjs/common';
import { AppointmentRepository } from '../repository/appointment.repository';

@Injectable()
export class ListAppointmentByCustomerService {
  constructor(private readonly appointmentRepo: AppointmentRepository) {}

  async execute({
    page,
    limit,
    customerId,
    fromDate,
    toDate,
  }: {
    page?: number;
    limit?: number;
    customerId: string;
    fromDate?: Date;
    toDate?: Date;
  }) {
    return this.appointmentRepo.findAll({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        customerId,
        start: {
          gte: fromDate,
          lte: toDate,
        },
      },
    });
  }
}
