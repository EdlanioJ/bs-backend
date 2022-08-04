import { ApiProperty } from '@nestjs/swagger';
import { AppointmentModel } from './appointment.models';

export class SimpleAppointmentModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  startAt: Date;

  @ApiProperty()
  endAt: Date;

  static map(appointment: AppointmentModel): SimpleAppointmentModel {
    return {
      id: appointment.id,
      startAt: appointment.startAt,
      endAt: appointment.endAt,
    };
  }

  static mapCollection(
    appointments: AppointmentModel[],
  ): SimpleAppointmentModel[] {
    return appointments.map(SimpleAppointmentModel.map);
  }
}
