import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/entities/role.enum';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AcceptManagerService } from './services/accept-manager.service';
import { RejectManagerService } from './services/reject-manager.service';
import { RequireManagerUserService } from './services/require-manager-user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly requireManagerService: RequireManagerUserService,
    private readonly acceptManagerService: AcceptManagerService,
    private readonly rejectManagerService: RejectManagerService,
  ) {}

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('require/manager')
  async requireManager(@GetCurrentUser('sub') userId: string) {
    return this.requireManagerService.execute({ userId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post(':id/accept/manager')
  async acceptManager(
    @GetCurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.acceptManagerService.execute({ userId, id });
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post(':id/reject/manager')
  async rejectManager(
    @GetCurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() { reason }: { reason: string },
  ) {
    return this.rejectManagerService.execute({ userId, id, reason });
  }
}
