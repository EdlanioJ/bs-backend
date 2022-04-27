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
  Res,
} from '@nestjs/common';
import { Response } from 'express';

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
  ApiTags,
  ApiUnauthorizedResponse,
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

  @ApiOkResponse({ type: TemplateModel, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response,
  ) {
    const { total, data } = await this.listTemplate.execute({
      page,
      limit,
    });

    res.setHeader('x-total-count', total);
    return data;
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
