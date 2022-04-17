export class CreateAppointmentDto {
  employeeId: string;
  customerId: string;
  serviceId: string;
  start: Date;
}

export class CreateAppointmentBody {
  employeeId: string;
  serviceId: string;
  date: Date;
}
