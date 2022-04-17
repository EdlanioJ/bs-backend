import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { OauthDto } from './dto/oauth.dto';
import { Tokens } from './dto/tokens.dto';
import { AuthPayload } from './dto/payload.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
  ) {}

  async validateOAuth(dto: OauthDto) {
    const user = await this.authRepository.findByThirdPartyId(dto.thirdPartyId);
    console.log('chegou');

    if (user)
      return this.authRepository.update(user.id, {
        ...dto,
      });

    return this.authRepository.create({
      ...dto,
    });
  }

  async login(payload: AuthPayload) {
    const tokens = await this.getTokens(
      payload.sub,
      payload.username,
      payload.role,
    );

    await this.updateRefreshToken(payload.sub, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    await this.authRepository.update(userId, {
      refreshToken: null,
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.authRepository.getById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('access denied');

    const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!tokenMatches) throw new ForbiddenException('access denied');

    const tokens = await this.getTokens(userId, user.name, user.email);
    await this.updateRefreshToken(userId, tokens.refresh_token);
    return tokens;
  }

  private async getTokens(userId: string, username: string, role: string) {
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

    return new Tokens({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  private hashData(data: string) {
    return bcrypt.hash(data, 12);
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hash = await this.hashData(refreshToken);

    await this.authRepository.update(userId, {
      refreshToken: hash,
    });
  }
}
