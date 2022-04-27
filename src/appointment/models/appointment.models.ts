import { ApiProperty } from '@nestjs/swagger';
import { Appointment } from '@prisma/client';

export class AppointmentModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  startAt: Date;

  @ApiProperty()
  endAt: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  canceledAt?: Date;

  @ApiProperty()
  canceledReason?: string;

  @ApiProperty()
  appointmentWith: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  service: string;

  @ApiProperty()
  createdAt: Date;
  static map(appointment: Appointment): AppointmentModel {
    return {
      id: appointment.id,
      createdAt: appointment.createdAt,
      canceledReason: appointment.canceledReason,
      appointmentWith: appointment.employeeId,
      userId: appointment.customerId,
      canceledAt: appointment.canceled,
      endAt: appointment.end,
      startAt: appointment.start,
      status: appointment.status,
      service: appointment.serviceId,
    };
  }

  static mapCollection(appointments: Appointment[]): AppointmentModel[] {
    return appointments.map(AppointmentModel.map);
  }
}
