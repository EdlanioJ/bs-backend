/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';

import { GetCurrentUser } from '../decorators';
import {
  AuthPayloadDto,
  ForgotPasswordDto,
  RegisterDto,
  ResetPasswordDto,
} from '../dto';
import {
  GoogleGuard,
  GoogleMobileGuard,
  JwtGuard,
  LocalGuard,
  RefreshJwtGuard,
} from '../guards';
import { TokensModel } from '../models';

import {
  LoginService,
  LogoutService,
  RegisterService,
  RefreshTokensService,
  ForgotPasswordService,
  ResetPasswordService,
} from '../services';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly logoutService: LogoutService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly configService: ConfigService,
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

  @Get('google/mobile')
  @UseGuards(GoogleMobileGuard)
  mobileGoogleAuth() {}

  @Get('google/mobile/callback')
  @UseGuards(GoogleMobileGuard)
  async googleCallbackMobile(
    @Res() res: Response,
    @GetCurrentUser() { role, sub, username }: AuthPayloadDto,
  ) {
    const { accessToken, refreshToken } = await this.loginService.execute({
      role,
      sub,
      username,
    });
    const deepLinking = this.configService.get('MOBILE_DEEP_LINKING');

    const uri =
      deepLinking +
      `?access_token=${accessToken}&refresh_token=${refreshToken}`;

    return res.redirect(uri);
  }

  @ApiBody({
    schema: {
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'admin@admin.com',
        },
        password: {
          type: 'string',
          example: 'admin123456',
        },
      },
    },
  })
  @ApiOkResponse({ type: TokensModel })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalGuard)
  localAuth(@GetCurrentUser() { role, sub, username }: AuthPayloadDto) {
    return this.loginService.execute({ role, sub, username });
  }

  @ApiCreatedResponse({ description: 'register user' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() { email, name, password }: RegisterDto) {
    return this.registerService.execute({ email, name, password });
  }

  @ApiNoContentResponse({ description: 'No Content' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('password/forgot')
  @HttpCode(HttpStatus.NO_CONTENT)
  forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return this.forgotPasswordService.execute({ email });
  }

  @ApiNoContentResponse()
  @Post('password/reset/:token')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(
    @Body() { password }: ResetPasswordDto,
    @Param('token') token: string,
  ) {
    return this.resetPasswordService.execute({ password, token });
  }

  @ApiBearerAuth('refresh-token')
  @ApiOkResponse({ type: TokensModel })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtGuard)
  refreshTokens(
    @GetCurrentUser('sub') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.refreshTokensService.execute({ userId, refreshToken });
  }

  @ApiBearerAuth('access-token')
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('logout')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@GetCurrentUser('sub') userId: string) {
    return this.logoutService.execute({ userId });
  }
}
