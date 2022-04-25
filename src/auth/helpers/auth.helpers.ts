import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { TokensModel } from '../models';

@Injectable()
export class AuthHelpers {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async hashData(data: string): Promise<string> {
    const salt = bcrypt.genSaltSync(12);
    return bcrypt.hash(data, salt);
  }

  async compareData(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }

  async generateTokens(
    userId: string,
    username: string,
    role: string,
  ): Promise<TokensModel> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          expiresIn: this.configService.get('JWT_SECRET_EXPIRE_IN'),
          secret: this.configService.get('JWT_SECRET'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRE_IN'),
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        },
      ),
    ]);

    return new TokensModel({
      accessToken,
      refreshToken,
    });
  }
}
