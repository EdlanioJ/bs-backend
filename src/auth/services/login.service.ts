import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UserRepository } from '../../user/repositories';
import { TokensModel } from '../models/tokens.model';

type Input = {
  sub: string;
  username: string;
  role: string;
};

@Injectable()
export class LoginService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute({ sub, username, role }: Input): Promise<TokensModel> {
    const tokens = await this.getTokens(sub, username, role);
    // update salt to an env var
    const hash = await bcrypt.hash(tokens.refreshToken, 12);

    await this.userRepo.update(sub, {
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
