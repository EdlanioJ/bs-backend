import { BadRequestException, Injectable } from '@nestjs/common';

import { UserRepository } from '../../user/repositories';
import { AuthHelpers } from '../helpers';

type Input = {
  password: string;
  email: string;
};

type Output = {
  id: string;
  username: string;
  role: string;
};

@Injectable()
export class ValidateWithCredentialsService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly authHelpers: AuthHelpers,
  ) {}

  async execute({ email, password }: Input): Promise<Output> {
    const user = await this.userRepo.findOneByEmail(email);
    if (!user) throw new BadRequestException('email or password is incorrect');
    if (!user.password)
      throw new BadRequestException('email or password is incorrect');

    const isValid = await this.authHelpers.compareData(password, user.password);
    if (!isValid)
      throw new BadRequestException('email or password is incorrect');

    return {
      id: user.id,
      username: user.name,
      role: user.role,
    };
  }
}
