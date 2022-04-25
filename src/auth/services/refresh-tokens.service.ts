import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UserRepository } from '../../user/repositories';
import { TokensModel } from '../models';

type Input = {
  userId: string;
  refreshToken: string;
};

type Output = TokensModel;

@Injectable()
export class RefreshTokensService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute({ refreshToken, userId }: Input): Promise<Output> {
    const user = await this.userRepo.findOne(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('access denied');

    const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!tokenMatches) throw new ForbiddenException('access denied');

    const tokens = await this.getTokens(userId, user.name, user.role);
    const hash = await bcrypt.hash(tokens.refreshToken, 12);
    await this.userRepo.update(userId, {
      refreshToken: hash,
    });

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

    return new TokensModel({
      accessToken,
      refreshToken,
    });
  }
}
