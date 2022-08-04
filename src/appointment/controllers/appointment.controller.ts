import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GetCurrentUser, Roles } from '../../auth/decorators';
import { JwtGuard, RolesGuard } from '../../auth/guards';
import {
  CancelAppointmentService,
  CompleteAppointmentService,
  CreateAppointmentService,
  GetAppointmentService,
  ListAppointmentService,
  ListAppointmentByCustomerService,
  ListAppointmentByEmployeeService,
} from '../services';
import {
  CancelAppointmentDto,
  CreateAppointmentDto,
  PaginateAppointmentQuery,
  SearchAppointmentQuery,
} from '../dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AppointmentModel, SimpleAppointmentModel } from '../models';
import { Role } from '../../auth/entities';

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
      startTime: new Date(startAt),
    });
  }

  @ApiOkResponse({ type: AppointmentModel })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  get(@Param('id') id: string) {
    return this.getAppointment.execute({ id });
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        rows: {
          type: 'array',
          items: { $ref: getSchemaPath(AppointmentModel) },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Query()
    { limit, orderBy, page, sort }: PaginateAppointmentQuery,
  ) {
    const { data, total } = await this.listAppointment.execute({
      page,
      limit,
      orderBy,
      sort,
    });
    return {
      rows: data,
      total,
      page,
      limit,
    };
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        rows: {
          type: 'array',
          items: { $ref: getSchemaPath(SimpleAppointmentModel) },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('employee/:id')
  @HttpCode(HttpStatus.OK)
  async listByEmployee(
    @Param('id') employeeId: string,
    @Query() { limit, orderBy, page, sort }: PaginateAppointmentQuery,
    @Query() { fromDate, toDate }: SearchAppointmentQuery,
  ) {
    const { data, total } = await this.listAppointmentByEmployee.execute({
      employeeId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      page,
      limit,
      orderBy,
      sort,
      status: ['PENDING', 'CONFIRMED'],
    });

    return {
      rows: SimpleAppointmentModel.mapCollection(data),
      total,
      page,
      limit,
    };
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        rows: {
          type: 'array',
          items: { $ref: getSchemaPath(AppointmentModel) },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiQuery({
    name: 'status',
    type: [String],
    required: false,
    example: ['PENDING', 'CONFIRMED', 'CANCELLED'],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('profile/user/')
  @HttpCode(HttpStatus.OK)
  async listProfileUser(
    @GetCurrentUser('sub') userId: string,
    @Query() { limit, orderBy, page, sort }: PaginateAppointmentQuery,
    @Query() { fromDate, toDate }: SearchAppointmentQuery,
    @Query() status: string[] = ['PENDING', 'CONFIRMED', 'COMPLETED'],
  ) {
    const { data, total } = await this.listAppointmentByCustomer.execute({
      customerId: userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      page,
      limit,
      orderBy,
      sort,
      status,
    });

    return {
      rows: data,
      total,
      page,
      limit,
    };
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        rows: {
          type: 'array',
          items: { $ref: getSchemaPath(AppointmentModel) },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiQuery({
    name: 'status',
    type: [String],
    required: false,
    example: ['PENDING', 'CONFIRMED', 'CANCELLED'],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('profile/employee/')
  @UseGuards(RolesGuard)
  @Roles(Role.EMPLOYEE)
  @HttpCode(HttpStatus.OK)
  async listProfileEmployee(
    @GetCurrentUser('sub') userId: string,
    @Query() { limit, orderBy, page, sort }: PaginateAppointmentQuery,
    @Query() { fromDate, toDate }: SearchAppointmentQuery,
    @Query() status: string[] = ['PENDING', 'CONFIRMED', 'COMPLETED'],
  ) {
    const { data, total } = await this.listAppointmentByEmployee.execute({
      employeeId: userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      page,
      limit,
      orderBy,
      sort,
      status,
    });

    return {
      rows: data,
      total,
      page,
      limit,
    };
  }

  @ApiNoContentResponse({ description: 'cancel appointment' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Patch('cancel/:id')
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
  @Patch('complete/:id')
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
