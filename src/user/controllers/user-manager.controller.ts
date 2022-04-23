import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { RejectManagerDto } from '../dto/reject-manager.dto';
import { AcceptManagerService } from '../services/accept-manager.service';
import { RejectManagerService } from '../services/reject-manager.service';
import { RequireManagerUserService } from '../services/require-manager-user.service';

import { GetCurrentUser } from '../../auth/decorators/get-current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/entities/role.enum';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

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
