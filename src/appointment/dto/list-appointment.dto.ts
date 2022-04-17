export class ListAppointmentDto {
  page?: number;
  limit?: number;
}

export class ListAppointmentWithIdDto {
  id: string;
  page?: number;
  limit?: number;
  startFrom?: Date;
  startTo?: Date;
}
