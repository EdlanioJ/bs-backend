import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsDate } from 'class-validator';
import { addDays } from 'date-fns';

export class PaginateAppointmentQuery {
  @ApiProperty({
    type: Number,
    default: 1,
    name: 'page',
    required: false,
    example: 1,
  })
  @Type(() => Number)
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
  @Type(() => Number)
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
  @IsOptional()
  orderBy = 'createdAt';

  @ApiProperty({
    enum: ['asc', 'desc'],
    default: 'desc',
    name: 'sort',
    required: false,
    type: String,
  })
  @IsOptional()
  sort = 'desc';
}

export class SearchAppointmentQuery {
  @ApiProperty({
    name: 'from_date',
    required: false,
    type: Date,
  })
  @Expose({ name: 'from_date' })
  @Type(() => Date)
  @IsDate()
  fromDate = new Date();

  @ApiProperty({
    name: 'to_date',
    required: false,
    type: Date,
  })
  @Expose({ name: 'to_date' })
  @Type(() => Date)
  @IsDate()
  toDate = addDays(this.fromDate, 14);
}
