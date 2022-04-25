import { Injectable } from '@nestjs/common';

import { SendMailProducerService } from '../../mail/services';
import { UserRepository } from '../../user/repositories';

type Input = {
  thirdPartyId: string;
  avatar: string;
  name: string;
  email: string;
  provider: string;
};

@Injectable()
export class ValidateOAuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly mailProducer: SendMailProducerService,
  ) {}

  async execute({ avatar, email, name, provider, thirdPartyId }: Input) {
    const user = await this.userRepo.findOneByThirdPartyId(thirdPartyId);

    if (user)
      return this.userRepo.update(user.id, {
        avatar,
        email,
        name,
        provider,
        thirdPartyId,
      });

    const newUser = await this.userRepo.create({
      avatar,
      email,
      name,
      thirdPartyId,
      provider,
    });

    await this.mailProducer.execute(
      {
        to: newUser.email,
        type: 'welcome-email',
        content: [
          {
            key: 'name',
            value: newUser.name,
          },
        ],
      },
      { attempts: 3 },
    );

    return newUser;
  }
}
