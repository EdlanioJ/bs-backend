import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../../user/repositories';
import {
  ProviderConnectionRepository,
  RequestConnectionRepository,
} from '../repositories';

type Input = {
  userId: string;
  requestId: string;
};
@Injectable()
export class AcceptConnectionService {
  constructor(
    private readonly useRepo: UserRepository,
    private readonly providerConnectionRepo: ProviderConnectionRepository,
    private readonly requestConnectionRepo: RequestConnectionRepository,
  ) {}
  async execute({ userId, requestId }: Input): Promise<void> {
    const user = await this.useRepo.findOne(userId);
    if (!user) throw new BadRequestException('User not found');

    if (user.role !== 'USER') throw new BadRequestException('Not a valid user');

    const requestConnection = await this.requestConnectionRepo.findOne(
      requestId,
    );
    if (!requestConnection)
      throw new BadRequestException('Connection Request not found');

    if (requestConnection.status === 'ACCEPTED')
      throw new BadRequestException('Connection already accepted');

    if (requestConnection.status === 'REJECTED')
      throw new BadRequestException('Connection Request rejected');

    if (requestConnection.employeeId !== userId)
      throw new BadRequestException('You are not the employee');

    await this.requestConnectionRepo.update(requestId, {
      status: 'ACCEPTED',
    });

    await this.useRepo.update(userId, {
      role: 'EMPLOYEE',
    });

    await this.providerConnectionRepo.create({
      user: { connect: { id: userId } },
      provider: { connect: { id: requestConnection.providerId } },
    });
  }
}
