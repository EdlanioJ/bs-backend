import { BadRequestException, Injectable } from '@nestjs/common';
import { isAfter } from 'date-fns';

import { SendMailProducerService } from '../../mail/services';
import { UserRepository } from '../../user/repositories';
import { AuthHelpers } from '../helpers';

type Input = {
  token: string;
  password: string;
};

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly mailProducer: SendMailProducerService,
    private readonly authHelpers: AuthHelpers,
  ) {}
  async execute({ password, token }: Input): Promise<void> {
    const user = await this.userRepo.findOneByResetToken(token);
    if (!user) throw new BadRequestException('Invalid token');

    if (isAfter(Date.now(), user.resetPasswordExpires))
      throw new BadRequestException('Token expired');

    const hashedPassword = await this.authHelpers.hashData(password);

    await this.userRepo.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    this.mailProducer.execute({
      to: user.email,
      type: 'reset-password-success',
      content: [
        {
          key: 'name',
          value: user.name,
        },
      ],
    });
  }
}
