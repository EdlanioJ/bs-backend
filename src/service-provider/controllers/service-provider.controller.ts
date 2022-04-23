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
import { Role } from '../../auth/entities/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtGuard } from '../../auth/guards/jwt.guard';

import { RolesGuard } from '../../auth/guards/roles.guard';
import { GetCurrentUser } from '../../auth/decorators/get-current-user.decorator';
import { AddServiceProviderDto } from '../dto/add-service-provider.dto';
import {
  AddServiceProviderService,
  DeleteServiceProviderService,
  GetServiceProviderService,
} from '../services';

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
