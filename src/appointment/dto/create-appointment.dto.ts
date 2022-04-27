import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty()
  employeeId: string;

  @ApiProperty()
  serviceId: string;

  @ApiProperty()
  startAt: Date;
}
