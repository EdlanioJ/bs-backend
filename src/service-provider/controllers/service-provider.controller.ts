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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
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
