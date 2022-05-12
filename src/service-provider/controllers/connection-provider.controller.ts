import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { Role } from '../../auth/entities';
import { GetCurrentUser, Roles } from '../../auth/decorators';
import { RolesGuard, JwtGuard } from '../../auth/guards';

import {
  AcceptConnectionService,
  DeleteConnectionService,
  ListConnectionByManagerService,
  ListConnectionService,
  RejectConnectionService,
  RequireConnectionService,
} from '../services';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProviderConnectionModel } from '../models';

@ApiTags('provider-connection')
@ApiBearerAuth('access-token')
@Controller('provider/connection')
@UseGuards(JwtGuard)
export class ConnectionProviderController {
  constructor(
    private readonly rejectConnection: RejectConnectionService,
    private readonly listConnection: ListConnectionService,
    private readonly listConnectionByManager: ListConnectionByManagerService,
    private readonly acceptConnection: AcceptConnectionService,
    private readonly deleteConnection: DeleteConnectionService,
    private readonly requireConnection: RequireConnectionService,
  ) {}

  @ApiCreatedResponse({
    description: 'connection request has been successfully created.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Roles(Role.MANAGER)
  @UseGuards(RolesGuard)
  @Post('require/:userId')
  @HttpCode(HttpStatus.CREATED)
  request(
    @GetCurrentUser('sub') providerOwnerId: string,
    @Param('userId') userToConnectId: string,
  ) {
    return this.requireConnection.execute({
      providerOwnerId,
      userToConnectId,
    });
  }

  @ApiCreatedResponse({
    description: 'connection has been successfully created.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @Post('accept/:id')
  @HttpCode(HttpStatus.CREATED)
  accept(
    @GetCurrentUser('sub') userId: string,
    @Param('id') requestId: string,
  ) {
    return this.acceptConnection.execute({
      userId,
      requestId,
    });
  }

  @ApiNoContentResponse({
    description: 'Connection has been rejected.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @Patch('reject/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  reject(
    @GetCurrentUser('sub') userId: string,
    @Param('id') requestId: string,
  ) {
    return this.rejectConnection.execute({
      userId,
      requestId,
    });
  }

  @ApiNoContentResponse({
    description: 'Connection has been deleted.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Roles(Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @GetCurrentUser('sub') userId: string,
    @Param('id') connectionId: string,
  ) {
    return this.deleteConnection.execute({
      userId,
      connectionId,
    });
  }

  @ApiOkResponse({
    type: ProviderConnectionModel,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Res() res: Response,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const { data, total } = await this.listConnection.execute({ page, limit });

    return res
      .set({ 'x-total-count': total, 'x-page': page, 'x-limit': limit })
      .json(data);
  }

  @ApiOkResponse({
    type: ProviderConnectionModel,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Roles(Role.MANAGER)
  @UseGuards(RolesGuard)
  @Get('manager')
  @HttpCode(HttpStatus.OK)
  async listByManager(
    @GetCurrentUser('sub') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Res() res: Response,
  ) {
    const { data, total } = await this.listConnectionByManager.execute({
      limit,
      page,
      userId,
    });

    return res
      .set({ 'x-total-count': total, 'x-page': page, 'x-limit': limit })
      .json(data);
  }
}
