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
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { CreateServiceDto } from '../dto';
import { GetCurrentUser } from '../../auth/decorators';
import { JwtGuard } from '../../auth/guards';
import {
  CreateProviderServiceService,
  GetProviderServiceService,
  ListProviderServiceService,
} from '../services';

@UseGuards(JwtGuard)
@Controller('service')
export class ServiceController {
  constructor(
    private readonly createService: CreateProviderServiceService,
    private readonly listService: ListProviderServiceService,
    private readonly getService: GetProviderServiceService,
  ) {}

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

  @Get()
  async list(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response,
  ) {
    const { data, total } = await this.listService.execute({
      limit,
      page,
    });

    res.setHeader('x-total-count', total);
    return data;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getService.execute({ id });
  }
}
