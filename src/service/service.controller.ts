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
import { ServiceService } from './service.service';
import { CreateServiceBody } from './dto/create-service.dto';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() { duration, name }: CreateServiceBody,
    @GetCurrentUser('sub') userId: string,
  ) {
    return this.serviceService.create({
      duration,
      name,
      userId,
    });
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.serviceService.findAll({
      limit,
      page,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }
}
