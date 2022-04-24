import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/repositories';

type Input = {
  userId: string;
};

@Injectable()
export class LogoutService {
  constructor(private readonly userRepo: UserRepository) {}

  async execute({ userId }: Input): Promise<void> {
    await this.userRepo.update(userId, {
      refreshToken: null,
    });
  }
}
