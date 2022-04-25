import { Injectable } from '@nestjs/common';

import { UserRepository } from '../../user/repositories';
import { AuthHelpers } from '../helpers';
import { TokensModel } from '../models';

type Input = {
  sub: string;
  username: string;
  role: string;
};

type Output = TokensModel;

@Injectable()
export class LoginService {
  constructor(
    private readonly authHelpers: AuthHelpers,
    private readonly userRepo: UserRepository,
  ) {}

  async execute({ sub, username, role }: Input): Promise<Output> {
    const tokens = await this.authHelpers.generateTokens(sub, username, role);
    // update salt to an env var
    const hash = await this.authHelpers.hashData(tokens.refreshToken);

    await this.userRepo.update(sub, {
      refreshToken: hash,
    });

    return tokens;
  }
}
