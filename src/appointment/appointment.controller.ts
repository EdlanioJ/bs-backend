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
import { CancelAppointmentBody } from './dto/cancel-appointment.dto';
import { CreateAppointmentBody } from './dto/create-appointment.dto';
import { CancelAppointmentService } from './services/cancel-appointment.service';
import { CompleteAppointmentService } from './services/complete-appointment.service';
import { CreateAppointmentService } from './services/create-appointment.service';
import { GetAppointmentService } from './services/get-appointment.service';
import { ListAppointmentByCustomerService } from './services/list-appointment-by-customer.service';
import { ListAppointmentByEmployeeService } from './services/list-appointment-by-employee.service';
import { ListAppointmentService } from './services/list-appointment.service';

@UseGuards(JwtGuard)
@Controller('appointment')
export class AppointmentController {
  constructor(
    private readonly cancelAppointment: CancelAppointmentService,
    private readonly completeAppointment: CompleteAppointmentService,
    private readonly createAppointment: CreateAppointmentService,
    private readonly getAppointment: GetAppointmentService,
    private readonly listAppointment: ListAppointmentService,
    private readonly listAppointmentByCustomer: ListAppointmentByCustomerService,
    private readonly listAppointmentByEmployee: ListAppointmentByEmployeeService,
  ) {}

  @Post()
  create(
    @Body() body: CreateAppointmentBody,
    @GetCurrentUser('sub') userId: string,
  ) {
    return this.createAppointment.execute({
      customerId: userId,
      employeeId: body.employeeId,
      serviceId: body.serviceId,
      startTime: body.date,
    });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.getAppointment.execute(id);
  }

  @Get()
  list(@Query('page') page: number, @Query('limit') limit: number) {
    return this.listAppointment.execute({ page, limit });
  }

  @Get('employee/:id')
  listByEmployee(
    @Param('id') employeeId: string,
    @Query('from_date') fromDate: string,
    @Query('to_date') toDate: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.listAppointmentByEmployee.execute({
      employeeId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
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
    return this.listAppointmentByCustomer.execute({
      customerId: userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
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
    return this.cancelAppointment.execute({
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
    return this.completeAppointment.execute({
      appointmentId,
      userId,
    });
  }
}
