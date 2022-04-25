import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '../prisma';
import { MailModule } from '../mail';
import { UserRepository } from '../user/repositories';

import { RolesGuard } from './guards';
import { AuthController } from './controllers';
import { GoogleStrategy, JwtStrategy, RefreshJwtStrategy } from './strategies';
import {
  LoginService,
  LogoutService,
  RefreshTokensService,
  ValidateOAuthService,
} from './services';

@Module({
  imports: [PassportModule, MailModule, JwtModule.register({}), PrismaModule],
  exports: [JwtStrategy, RolesGuard],
  providers: [
    GoogleStrategy,
    JwtStrategy,
    ValidateOAuthService,
    LoginService,
    LogoutService,
    RefreshTokensService,
    RolesGuard,
    RefreshJwtStrategy,
    UserRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
