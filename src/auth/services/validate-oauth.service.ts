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

type Output = {
  id: string;
  username: string;
  role: string;
};

@Injectable()
export class ValidateOAuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly mailProducer: SendMailProducerService,
  ) {}

  async execute({
    avatar,
    email,
    name,
    provider,
    thirdPartyId,
  }: Input): Promise<Output> {
    const user = await this.userRepo.findOneByThirdPartyId(thirdPartyId);

    if (user) {
      const updatedUser = await this.userRepo.update(user.id, {
        avatar,
        email,
        name,
        provider,
        thirdPartyId,
      });

      return {
        id: updatedUser.id,
        username: updatedUser.name,
        role: updatedUser.role,
      };
    }
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

    return {
      id: newUser.id,
      username: newUser.name,
      role: newUser.role,
    };
  }
}
