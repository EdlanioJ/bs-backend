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

import { CreateTemplateDto } from '../dto';
import {
  CreateTemplateService,
  DeleteTemplateService,
  ListTemplateService,
  GetTemplateService,
} from '../services';

import { GetCurrentUser, Roles } from '../../auth/decorators';
import { JwtGuard, RolesGuard } from '../../auth/guards';
import { Role } from '../../auth/entities';
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
import { TemplateModel } from '../models';

@ApiTags('template')
@ApiBearerAuth('access-token')
@Controller('template')
@Roles(Role.ADMIN)
@UseGuards(JwtGuard, RolesGuard)
export class TemplateController {
  constructor(
    private readonly listTemplate: ListTemplateService,
    private readonly getTemplate: GetTemplateService,
    private readonly createTemplate: CreateTemplateService,
    private readonly deleteTemplate: DeleteTemplateService,
  ) {}

  @ApiCreatedResponse({
    description: 'template has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateTemplateDto,
    @GetCurrentUser('id') userId: string,
  ) {
    return this.createTemplate.execute({
      ...dto,
      userId,
    });
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        templates: { $ref: getSchemaPath(TemplateModel) },
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
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('order_by') orderBy = 'createdAt',
    @Query('sort') sort = 'desc',
  ) {
    const { total, data } = await this.listTemplate.execute({
      page,
      limit,
      orderBy,
      sort,
    });

    return {
      templates: data,
      page,
      limit,
      total,
    };
  }

  @ApiOkResponse({ type: TemplateModel })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  get(@Param('id') id: string) {
    return this.getTemplate.execute({ id });
  }

  @Delete(':id')
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.deleteTemplate.execute({ id });
  }
}
