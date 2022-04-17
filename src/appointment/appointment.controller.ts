import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AppointmentService } from './appointment.service';
import { CancelAppointmentBody } from './dto/cancel-appointment.dto';
import { CreateAppointmentBody } from './dto/create-appointment.dto';

@UseGuards(JwtGuard)
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(
    @Body() body: CreateAppointmentBody,
    @GetCurrentUser('sub') userId: string,
  ) {
    return this.appointmentService.create({
      customerId: userId,
      employeeId: body.employeeId,
      serviceId: body.serviceId,
      start: body.date,
    });
  }

  @Get()
  list(@Query('page') page: number, @Query('limit') limit: number) {
    return this.appointmentService.list({ page, limit });
  }

  @Get('employee/:id')
  listByEmployee(
    @Param('id') employeeId: string,
    @Query('from_date') fromDate: string,
    @Query('to_date') toDate: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.appointmentService.listByEmployee({
      id: employeeId,
      startFrom: new Date(fromDate),
      startTo: new Date(toDate),
      page,
      limit,
    });
  }

  @Get('customer')
  listByCustomer(
    @GetCurrentUser('sub') userId: string,
    @Query('from_date') fromDate: string,
    @Query('to_date') toDate: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.appointmentService.listByCustomer({
      id: userId,
      startFrom: new Date(fromDate),
      startTo: new Date(toDate),
      page,
      limit,
    });
  }

  @Patch(':id/cancel')
  cancel(
    @Body() body: CancelAppointmentBody,
    @Param('id') appointmentId: string,
    @GetCurrentUser('sub') userId: string,
  ) {
    return this.appointmentService.cancel({
      appointmentId,
      userId,
      reason: body.cancelReason,
    });
  }

  @Patch(':id/complete')
  complete(
    @Param('id') appointmentId: string,
    @GetCurrentUser('sub') userId: string,
  ) {
    return this.appointmentService.complete({
      appointmentId,
      userId,
    });
  }
}
