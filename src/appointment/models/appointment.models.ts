import { Appointment } from '@prisma/client';

export class AppointmentModel {
  id: string;
  startAt: Date;
  endAt: Date;
  status: string;
  canceledAt?: Date;
  canceledReason?: string;
  appointmentWith: string;
  userId: string;
  service: string;
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
