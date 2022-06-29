import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';

import { CreateServiceDto } from '../dto';
import { GetCurrentUser } from '../../auth/decorators';
import { JwtGuard, RolesGuard } from '../../auth/guards';
import { Roles } from '../../auth/decorators';
import { Role } from '../../auth/entities';

import {
  CreateProviderServiceService,
  GetProviderServiceService,
  ListProviderServiceService,
} from '../services';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ServiceModel } from '../models';

@ApiTags('service')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('service')
export class ServiceController {
  constructor(
    private readonly createService: CreateProviderServiceService,
    private readonly listService: ListProviderServiceService,
    private readonly getService: GetProviderServiceService,
  ) {}

  @ApiCreatedResponse({
    description: 'The service has been successfully created.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Roles(Role.MANAGER)
  @UseGuards(RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() { appointmentDurationInMinutes, name }: CreateServiceDto,
    @GetCurrentUser('sub') userId: string,
  ) {
    return this.createService.execute({
      appointmentDurationInMinutes,
      name,
      userId,
    });
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        services: {
          type: 'array',
          items: { $ref: getSchemaPath(ServiceModel) },
        },
        page: { type: 'number' },
        limit: { type: 'number' },
        total: { type: 'number' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'order_by',
    required: false,
    type: String,
    enum: ['createdAt', 'name'],
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async list(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('order_by') orderBy = 'createdAt',
    @Query('sort') sort = 'desc',
  ) {
    const { data, total } = await this.listService.execute({
      limit,
      page,
      orderBy,
      sort,
    });

    return {
      services: data,
      total,
      page,
      limit,
    };
  }

  @ApiOkResponse({ type: ServiceModel })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getService.execute({ id });
  }
}
