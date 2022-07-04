import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
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
  page?: number = 1;

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
  limit?: number = 10;

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
  orderBy?: string = 'createdAt';

  @ApiProperty({
    enum: ['asc', 'desc'],
    default: 'desc',
    name: 'sort',
    required: false,
    type: String,
  })
  @IsOptional()
  sort?: string = 'desc';
}

export class SearchAppointmentQuery {
  @ApiProperty({
    name: 'from_date',
    required: false,
    type: Date,
  })
  @Expose({ name: 'from_date' })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  fromDate?: Date = new Date();

  @ApiProperty({
    name: 'to_date',
    required: false,
    type: Date,
  })
  @Expose({ name: 'to_date' })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  toDate?: Date = addDays(this.fromDate, 14);
}
