/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { GetCurrentUser } from '../decorators';
import { AuthPayloadDto } from '../dto';
import { GoogleGuard, JwtGuard, RefreshJwtGuard } from '../guards';

import {
  LoginService,
  LogoutService,
  RefreshTokensService,
  ValidateOAuthService,
} from '../services';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly logoutService: LogoutService,
    private readonly validateOAutService: ValidateOAuthService,
    private readonly refreshTokensService: RefreshTokensService,
  ) {}

  @Get('google')
  @UseGuards(GoogleGuard)
  googleAuth() {}

  @Get('google/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleGuard)
  googleAuthCallback(
    @GetCurrentUser() { role, sub, username }: AuthPayloadDto,
  ) {
    return this.loginService.execute({ role, sub, username });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtGuard)
  refreshTokens(
    @GetCurrentUser('sub') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.refreshTokensService.execute({ userId, refreshToken });
  }

  @Get('logout')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@GetCurrentUser('sub') userId: string) {
    return this.logoutService.execute({ userId });
  }
}
