export class CancelAppointmentDto {
  appointmentId: string;
  userId: string;
  reason: string;
}

export class CancelAppointmentBody {
  cancelReason: string;
}
