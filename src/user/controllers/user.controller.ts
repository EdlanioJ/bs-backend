import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetCurrentUser } from '../../auth/decorators';
import { JwtGuard } from '../../auth/guards';
import { UserModel } from '../models';
import { GetUserService } from '../services';

@ApiTags('user')
@ApiBearerAuth('access-token')
@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly getUserService: GetUserService) {}

  @ApiOkResponse({ type: UserModel })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  async profile(@GetCurrentUser('sub') userId: string) {
    return this.getUserService.execute({ id: userId });
  }
}
