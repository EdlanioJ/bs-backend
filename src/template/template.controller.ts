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
import { Roles } from '../auth/decorators/roles.decorator';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateTemplateBody } from './dto/create-template.dto';
import { TemplateService } from './template.service';
import { Role } from '../auth/entities/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('template')
@Roles(Role.ADMIN)
@UseGuards(JwtGuard, RolesGuard)
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() body: CreateTemplateBody,
    @GetCurrentUser('id') userId: string,
  ) {
    return this.templateService.create({
      ...body,
      userId,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.templateService.findAll({
      limit,
      page,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.templateService.delete(id);
  }
}
