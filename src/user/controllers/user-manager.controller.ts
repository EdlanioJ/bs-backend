import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';

import { RejectManagerDto } from '../dto';
import {
  AcceptManagerService,
  ListManagerRequestService,
  RejectManagerService,
  RequireManagerUserService,
} from '../services';

import { GetCurrentUser, Roles } from '../../auth/decorators';
import { RolesGuard, JwtGuard } from '../../auth/guards';

import { Role } from '../../auth/entities';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ManagerRequestModel } from '../models';
import { Response } from 'express';

@ApiTags('manager')
@ApiBearerAuth('access-token')
@Controller('user/manager')
export class UserManagerController {
  constructor(
    private readonly listManagerRequest: ListManagerRequestService,
    private readonly requireManager: RequireManagerUserService,
    private readonly acceptManager: AcceptManagerService,
    private readonly rejectManager: RejectManagerService,
  ) {}

  @ApiOkResponse({ type: ManagerRequestModel, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('request')
  async listRequest(
    @Res() res: Response,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const { total, data } = await this.listManagerRequest.execute({
      limit,
      page,
    });

    return res
      .set({ 'x-total-count': total, 'x-page': page, 'x-limit': limit })
      .json(data);
  }

  @ApiCreatedResponse({ description: 'create manager request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Roles(Role.USER)
  @UseGuards(JwtGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('request')
  async require(@GetCurrentUser('sub') userId: string) {
    return this.requireManager.execute({ userId });
  }

  @ApiCreatedResponse({ description: 'manager request accepted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('request/accept/:id')
  async accept(
    @GetCurrentUser('sub') userId: string,
    @Param('id') requestId: string,
  ) {
    return this.acceptManager.execute({ userId, requestId });
  }

  @ApiNoContentResponse({ description: 'manager request rejected' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('request/:id/reject')
  async reject(
    @GetCurrentUser('sub') userId: string,
    @Param('id') requestId: string,
    @Body() { reason }: RejectManagerDto,
  ) {
    return this.rejectManager.execute({ userId, requestId, reason });
  }
}
