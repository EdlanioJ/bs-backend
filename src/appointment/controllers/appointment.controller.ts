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
  @Get()
  @HttpCode(HttpStatus.OK)
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

  @ApiOkResponse({ type: AppointmentModel, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('employee/:id')
  @HttpCode(HttpStatus.OK)
  async listByEmployee(
    @Param('id') employeeId: string,
    @Query('from_date') fromDate: Date,
    @Query('to_date') toDate: Date,
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

  @ApiOkResponse({ type: AppointmentModel, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('customer')
  @HttpCode(HttpStatus.OK)
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
