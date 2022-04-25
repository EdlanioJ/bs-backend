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

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response,
  ) {
    const { data, total } = await this.listConnection.execute({ page, limit });

    res.setHeader('x-total-count', total);
    return data;
  }

  @Roles(Role.MANAGER)
  @UseGuards(RolesGuard)
  @Get('manager')
  @HttpCode(HttpStatus.OK)
  async listByManager(
    @GetCurrentUser('sub') userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response,
  ) {
    const { data, total } = await this.listConnectionByManager.execute({
      limit,
      page,
      userId,
    });

    res.setHeader('x-total-count', total);
    return data;
  }
}
