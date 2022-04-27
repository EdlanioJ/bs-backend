import { ApiProperty } from '@nestjs/swagger';

export class CreateTemplateDto {
  @ApiProperty()
  body: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  subject: string;
}
