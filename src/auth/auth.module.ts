import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesGuard } from './guards/roles.guard';
import { MailModule } from '../mail/mail.module';
import { UserRepository } from '../user/repositories/user.repository';

@Module({
  imports: [PassportModule, MailModule, JwtModule.register({}), PrismaModule],
  exports: [AuthService, JwtStrategy],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    RolesGuard,
    RefreshJwtStrategy,
    UserRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
