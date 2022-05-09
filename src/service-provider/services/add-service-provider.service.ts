import { BadRequestException, Injectable } from '@nestjs/common';

import { UserRepository } from '../../user/repositories';
import { ServiceProviderRepository } from '../repositories';

type Input = {
  userId: string;
  name: string;
};

@Injectable()
export class AddServiceProviderService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly providerRepo: ServiceProviderRepository,
  ) {}

  async execute({ userId, name }: Input): Promise<void> {
    const user = await this.userRepo.findOne(userId);
    if (!user) throw new BadRequestException('User not found');
    if (user.role !== 'MANAGER')
      throw new BadRequestException('User is not a manager');

    await this.providerRepo.create({ user: { connect: { id: userId } }, name });
  }
}
