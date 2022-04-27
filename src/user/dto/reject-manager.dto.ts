import { ApiProperty } from '@nestjs/swagger';

export class RejectManagerDto {
  @ApiProperty()
  reason: string;
}
