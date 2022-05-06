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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GetCurrentUser } from '../../auth/decorators';
import { JwtGuard } from '../../auth/guards';
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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppointmentModel } from '../models';

@ApiTags('appointment')
@ApiBearerAuth('access-token')
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

  @ApiCreatedResponse({ description: 'create appointment' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
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

  @ApiOkResponse({ type: AppointmentModel })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  get(@Param('id') id: string) {
    return this.getAppointment.execute({ id });
  }

  @ApiOkResponse({ type: AppointmentModel, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Res() res: Response,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const { data, total } = await this.listAppointment.execute({ page, limit });
    return res
      .set({ 'x-total-count': total, 'x-page': page, 'x-limit': limit })
      .json(data);
  }

  @ApiOkResponse({ type: AppointmentModel, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'from_date', required: true, type: Date })
  @ApiQuery({ name: 'to_date', required: true, type: Date })
  @Get('employee/:id')
  @HttpCode(HttpStatus.OK)
  async listByEmployee(
    @Res() res: Response,
    @Param('id') employeeId: string,
    @Query('from_date') fromDate: Date,
    @Query('to_date') toDate: Date,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const { data, total } = await this.listAppointmentByEmployee.execute({
      employeeId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      page,
      limit,
    });

    return res
      .set({ 'x-total-count': total, 'x-page': page, 'x-limit': limit })
      .json(data);
  }

  @ApiOkResponse({ type: AppointmentModel, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'from_date', required: true, type: Date })
  @ApiQuery({ name: 'to_date', required: true, type: Date })
  @Get('customer')
  @HttpCode(HttpStatus.OK)
  async listByCustomer(
    @Res() res: Response,
    @GetCurrentUser('sub') userId: string,
    @Query('from_date') fromDate: Date,
    @Query('to_date') toDate: Date,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const { data, total } = await this.listAppointmentByCustomer.execute({
      customerId: userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      page,
      limit,
    });

    return res
      .set({ 'x-total-count': total, 'x-page': page, 'x-limit': limit })
      .json(data);
  }

  @ApiNoContentResponse({ description: 'cancel appointment' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Patch(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
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

  @ApiNoContentResponse({ description: 'complete appointment' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Patch(':id/complete')
  @HttpCode(HttpStatus.NO_CONTENT)
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
