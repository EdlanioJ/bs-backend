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

import { Role } from '../../auth/entities';
import { RolesGuard, JwtGuard } from '../../auth/guards';
import { GetCurrentUser, Roles } from '../../auth/decorators';

import { AddServiceProviderDto } from '../dto';
import {
  AddServiceProviderService,
  DeleteServiceProviderService,
  GetServiceProviderService,
} from '../services';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServiceProviderModel } from '../models';

@ApiTags('provider')
@ApiBearerAuth('access-token')
@Controller('provider')
@UseGuards(JwtGuard)
export class ServiceProviderController {
  constructor(
    private readonly addProvider: AddServiceProviderService,
    private readonly getProvider: GetServiceProviderService,
    private readonly deleteProvider: DeleteServiceProviderService,
  ) {}

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

  @ApiResponse({ status: HttpStatus.OK, type: ServiceProviderModel })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  get(@Param('id') id: string) {
    return this.getProvider.execute({ id });
  }

  @Roles(Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@GetCurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.deleteProvider.execute({ id, userId });
  }
}
