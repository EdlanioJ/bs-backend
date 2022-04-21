import { Injectable } from '@nestjs/common';
import { AppointmentRepository } from '../repository/appointment.repository';

@Injectable()
export class ListAppointmentByEmployeeService {
  constructor(private readonly appointmentRepo: AppointmentRepository) {}

  async execute({
    page,
    limit,
    employeeId,
    fromDate,
    toDate,
  }: {
    page?: number;
    limit?: number;
    employeeId: string;
    fromDate?: Date;
    toDate?: Date;
  }) {
    return this.appointmentRepo.findAll({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        employeeId,
        start: {
          gte: fromDate,
          lte: toDate,
        },
      },
    });
  }
}
