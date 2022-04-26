import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '../prisma';
import { MailModule } from '../mail';
import { UserRepository } from '../user/repositories';

import { RolesGuard } from './guards';
import { AuthController } from './controllers';
import {
  RefreshJwtStrategy,
  GoogleStrategy,
  LocalStrategy,
  JwtStrategy,
} from './strategies';
import {
  LoginService,
  LogoutService,
  RefreshTokensService,
  ValidateOAuthService,
  ValidateWithCredentialsService,
} from './services';
import { AuthHelpers } from './helpers';

@Module({
  imports: [PassportModule, MailModule, JwtModule.register({}), PrismaModule],
  exports: [JwtStrategy, RolesGuard],
  providers: [
    RefreshJwtStrategy,
    GoogleStrategy,
    LocalStrategy,
    JwtStrategy,
    AuthHelpers,
    ValidateWithCredentialsService,
    ValidateOAuthService,
    RefreshTokensService,
    LogoutService,
    LoginService,
    RolesGuard,
    UserRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
