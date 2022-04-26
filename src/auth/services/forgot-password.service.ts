import { BadRequestException, Injectable } from '@nestjs/common';

import { addHours } from 'date-fns';
import crypto from 'crypto';

import { UserRepository } from '../../user/repositories';
import { SendMailProducerService } from '../../mail/services';

type Input = {
  email: string;
};

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly mailProducer: SendMailProducerService,
  ) {}

  async execute({ email }: Input): Promise<void> {
    const user = await this.userRepo.findOneByEmail(email);
    if (!user) throw new BadRequestException('User not found');

    const resetPasswordToken = crypto.randomBytes(48).toString('hex');
    const resetPasswordExpires = addHours(Date.now(), 1);

    await this.userRepo.update(user.id, {
      resetPasswordExpires,
      resetPasswordToken,
    });

    await this.mailProducer.execute({
      to: user.email,
      type: 'reset-password',
      content: [
        {
          key: 'name',
          value: user.name,
        },
        {
          key: 'token',
          value: resetPasswordToken,
        },
      ],
    });
  }
}
