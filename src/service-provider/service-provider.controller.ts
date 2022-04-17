import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateServiceProviderBody } from './dto/create-provider.dto';
import { ServiceProviderService } from './service-provider.service';

@Controller('provider')
@UseGuards(JwtGuard)
export class ServiceProviderController {
  constructor(private readonly providerService: ServiceProviderService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() body: CreateServiceProviderBody,
    @GetCurrentUser('sub') userId: string,
  ) {
    return this.providerService.create({ name: body.name, userId });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') providerId: string) {
    return this.providerService.findOne(providerId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @GetCurrentUser('sub') userId: string,
    @Param('id') providerId: string,
  ) {
    return this.providerService.delete({ providerId, userId });
  }
}
