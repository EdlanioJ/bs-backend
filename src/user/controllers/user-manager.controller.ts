import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { RejectManagerDto } from '../dto';
import {
  AcceptManagerService,
  RejectManagerService,
  RequireManagerUserService,
} from '../services';

import { GetCurrentUser, Roles } from '../../auth/decorators';
import { RolesGuard, JwtGuard } from '../../auth/guards';

import { Role } from '../../auth/entities';

@Controller('user/manager')
export class UserManagerController {
  constructor(
    private readonly requireManager: RequireManagerUserService,
    private readonly acceptManager: AcceptManagerService,
    private readonly rejectManager: RejectManagerService,
  ) {}

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('require')
  async require(@GetCurrentUser('sub') userId: string) {
    return this.requireManager.execute({ userId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post(':id/accept')
  async accept(@GetCurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.acceptManager.execute({ userId, id });
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post(':id/reject')
  async reject(
    @GetCurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() { reason }: RejectManagerDto,
  ) {
    return this.rejectManager.execute({ userId, id, reason });
  }
}
