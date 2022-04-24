import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { GetCurrentUser } from '../../auth/decorators/get-current-user.decorator';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import {
  CancelAppointmentService,
  CompleteAppointmentService,
  CreateAppointmentService,
  GetAppointmentService,
  ListAppointmentService,
  ListAppointmentByCustomerService,
  ListAppointmentByEmployeeService,
} from '../services';
import { CancelAppointmentDto, CreateAppointmentDto } from '../dto';
import { Response } from 'express';

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
    @Body() { employeeId, serviceId, startAt }: CreateAppointmentDto,
    @GetCurrentUser('sub') userId: string,
  ) {
    return this.createAppointment.execute({
      customerId: userId,
      employeeId: employeeId,
      serviceId: serviceId,
      startTime: startAt,
    });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.getAppointment.execute({ id });
  }

  @Get()
  async list(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response,
  ) {
    const {
      data,
      limit: Limit,
      page: Page,
      total,
    } = await this.listAppointment.execute({ page, limit });

    res.setHeader('x-total-count', total);
    res.setHeader('x-page', Page);
    res.setHeader('x-limit', Limit);
    return data;
  }

  @Get('employee/:id')
  async listByEmployee(
    @Param('id') employeeId: string,
    @Query('from_date') fromDate: string,
    @Query('to_date') toDate: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response,
  ) {
    const {
      data,
      limit: Limit,
      page: Page,
      total,
    } = await this.listAppointmentByEmployee.execute({
      employeeId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      page,
      limit,
    });

    res.setHeader('x-total-count', total);
    res.setHeader('x-page', Page);
    res.setHeader('x-limit', Limit);
    return data;
  }

  @Get('customer')
  async listByCustomer(
    @GetCurrentUser('sub') userId: string,
    @Query('from_date') fromDate: string,
    @Query('to_date') toDate: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response,
  ) {
    const {
      data,
      limit: Limit,
      page: Page,
      total,
    } = await this.listAppointmentByCustomer.execute({
      customerId: userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      page,
      limit,
    });

    res.setHeader('x-total-count', total);
    res.setHeader('x-page', Page);
    res.setHeader('x-limit', Limit);
    return data;
  }

  @Patch(':id/cancel')
  cancel(
    @Body() { cancelReason }: CancelAppointmentDto,
    @Param('id') appointmentId: string,
    @GetCurrentUser('sub') userId: string,
  ) {
    return this.cancelAppointment.execute({
      appointmentId,
      userId,
      reason: cancelReason,
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
