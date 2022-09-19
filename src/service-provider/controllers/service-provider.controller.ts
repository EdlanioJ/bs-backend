import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Role } from '../../auth/entities';
import { RolesGuard, JwtGuard } from '../../auth/guards';
import { GetCurrentUser, Roles } from '../../auth/decorators';

import { AddServiceProviderDto } from '../dto';
import {
  AddServiceProviderService,
  DeleteServiceProviderService,
  GetServiceProviderService,
  ListProviderService,
} from '../services';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ServiceProviderModel } from '../models';

@ApiTags('provider')
@ApiBearerAuth('access-token')
@Controller('provider')
@UseGuards(JwtGuard)
export class ServiceProviderController {
  constructor(
    private readonly addProvider: AddServiceProviderService,
    private readonly getProvider: GetServiceProviderService,
    private readonly listProvider: ListProviderService,
    private readonly deleteProvider: DeleteServiceProviderService,
  ) {}

  @ApiCreatedResponse({
    description: 'provider has been successfully created.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Roles(Role.MANAGER)
  @UseGuards(RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  add(
    @Body() { name }: AddServiceProviderDto,
    @GetCurrentUser('sub') userId: string,
  ) {
    return this.addProvider.execute({ name, userId });
  }

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'order_by',
    required: false,
    type: String,
    enum: ['createdAt', 'id'],
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @ApiOkResponse({ status: HttpStatus.OK, type: ServiceProviderModel })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('order_by') orderBy = 'createdAt',
    @Query('sort') sort = 'desc',
  ) {
    const { data, total } = await this.listProvider.execute({
      limit,
      page,
      orderBy,
      sort,
    });

    return {
      rows: data,
      count: total,
      page,
      limit,
    };
  }

  @ApiOkResponse({ status: HttpStatus.OK, type: ServiceProviderModel })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  get(@Param('id') id: string) {
    return this.getProvider.execute({ id });
  }

  @ApiNoContentResponse({
    description: 'provider has been successfully deleted.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Roles(Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@GetCurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.deleteProvider.execute({ id, userId });
  }
}
