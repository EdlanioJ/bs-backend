import { ForbiddenException, Injectable } from '@nestjs/common';

import { UserRepository } from '../../user/repositories';
import { AuthHelpers } from '../helpers';
import { TokensModel } from '../models';

type Input = {
  userId: string;
  refreshToken: string;
};

type Output = TokensModel;

@Injectable()
export class RefreshTokensService {
  constructor(
    private readonly authHelpers: AuthHelpers,
    private readonly userRepo: UserRepository,
  ) {}

  async execute({ refreshToken, userId }: Input): Promise<Output> {
    const user = await this.userRepo.findOne(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('access denied');

    const tokenMatches = await this.authHelpers.compareData(
      refreshToken,
      user.refreshToken,
    );

    if (!tokenMatches) throw new ForbiddenException('access denied');

    const tokens = await this.authHelpers.generateTokens(
      userId,
      user.name,
      user.role,
    );

    const hash = await this.authHelpers.hashData(tokens.refreshToken);

    await this.userRepo.update(userId, {
      refreshToken: hash,
    });

    return tokens;
  }
}
