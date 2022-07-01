import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { addDays } from 'date-fns';

export class PaginateAppointmentQuery {
  @ApiProperty({
    type: Number,
    default: 1,
    name: 'page',
    required: false,
    example: 1,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  page = 1;

  @ApiProperty({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    default: 10,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  limit = 10;

  @ApiProperty({
    name: 'order_by',
    required: false,
    type: String,
    default: 'createdAt',
    enum: ['createdAt', 'start', 'end'],
    example: 'createdAt',
  })
  @Expose({ name: 'order_by' })
  orderBy = 'createdAt';

  @ApiProperty({
    enum: ['asc', 'desc'],
    default: 'desc',
    name: 'sort',
    required: false,
    type: String,
  })
  sort = 'desc';
}

export class SearchAppointmentQuery {
  @ApiProperty({
    name: 'from_date',
    required: true,
    type: Date,
  })
  @Expose({ name: 'from_date' })
  @Transform(({ value }) => new Date(value))
  fromDate = new Date();

  @ApiProperty({
    name: 'to_date',
    required: true,
    type: Date,
  })
  @Expose({ name: 'to_date' })
  @Transform(({ value }) => new Date(value))
  toDate = addDays(this.fromDate, 14);
}
