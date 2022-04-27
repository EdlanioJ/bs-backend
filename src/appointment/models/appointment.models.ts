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
  static map(data: Appointment): AppointmentModel {
    return {
      ...data,
      appointmentWith: data.employeeId,
      userId: data.customerId,
      canceledAt: data.canceled,
      endAt: data.end,
      startAt: data.start,
      status: data.status,
      service: data.serviceId,
    };
  }

  static mapCollection(data: Appointment[]): AppointmentModel[] {
    return data.map(AppointmentModel.map);
  }
}
