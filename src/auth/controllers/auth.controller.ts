/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { GetCurrentUser } from '../decorators';
import {
  AuthPayloadDto,
  ForgotPasswordDto,
  RegisterDto,
  ResetPasswordDto,
} from '../dto';
import { GoogleGuard, JwtGuard, LocalGuard, RefreshJwtGuard } from '../guards';

import {
  LoginService,
  LogoutService,
  RegisterService,
  RefreshTokensService,
  ForgotPasswordService,
  ResetPasswordService,
} from '../services';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly logoutService: LogoutService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly resetPasswordService: ResetPasswordService,
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

  @Get('login')
  @UseGuards(LocalGuard)
  localAuth(@GetCurrentUser() { role, sub, username }: AuthPayloadDto) {
    return this.loginService.execute({ role, sub, username });
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() { email, name, password }: RegisterDto) {
    return this.registerService.execute({ email, name, password });
  }

  @Post('password/forgot')
  @HttpCode(HttpStatus.NO_CONTENT)
  forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return this.forgotPasswordService.execute({ email });
  }

  @Post('password/reset/:token')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(
    @Body() { password }: ResetPasswordDto,
    @Param('token') token: string,
  ) {
    return this.resetPasswordService.execute({ password, token });
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
