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

import { CreateTemplateDto } from '../dto/create-template.dto';
import { ListTemplateService } from '../services/list-template.service';
import { CreateTemplateService } from '../services/create-template.service';
import { GetTemplateService } from '../services/get-template.service';
import { DeleteTemplateService } from '../services/delete-template.service';

import { GetCurrentUser } from '../../auth/decorators/get-current-user.decorator';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/entities/role.enum';
import { RolesGuard } from '../../auth/guards/roles.guard';

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

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.getTemplate.execute({ id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.deleteTemplate.execute({ id });
  }
}
