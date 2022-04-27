import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  appointmentDurationInMinutes: number;
}
