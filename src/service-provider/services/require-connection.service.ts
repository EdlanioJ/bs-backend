import { Injectable, BadRequestException } from '@nestjs/common';

import { SendMailProducerService } from '../../mail/services';
import { UserRepository } from '../../user/repositories';
import {
  RequestConnectionRepository,
  ServiceProviderRepository,
} from '../repositories';

type Input = {
  providerOwnerId: string;
  userToConnectId: string;
};
@Injectable()
export class RequireConnectionService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly providerRepo: ServiceProviderRepository,
    private readonly requestConnectionRepo: RequestConnectionRepository,
    private readonly mailProducer: SendMailProducerService,
  ) {}

  async execute({ providerOwnerId, userToConnectId }: Input): Promise<void> {
    const provider = await this.providerRepo.findByUserId(providerOwnerId);
    if (!provider) throw new BadRequestException('Provider not found');

    const userToConnect = await this.userRepo.findOne(userToConnectId);
    if (!userToConnect)
      throw new BadRequestException('User to connect not found');

    if (userToConnect.role !== 'USER')
      throw new BadRequestException('Not a valid user to connect');

    const checkAvailability = await this.requestConnectionRepo.findAvailable(
      provider.id,
      userToConnect.id,
    );

    if (checkAvailability)
      throw new BadRequestException('Connection request already sent');

    const requestConnection = await this.requestConnectionRepo.create({
      provider: { connect: { id: provider.id } },
      employee: { connect: { id: userToConnect.id } },
    });

    await this.mailProducer.execute({
      to: userToConnect.email,
      type: 'connection-request',
      content: [
        {
          key: 'name',
          value: userToConnect.name,
        },
        {
          key: 'providerName',
          value: provider.name,
        },
        {
          key: 'requestConnectionId',
          value: requestConnection.id,
        },
      ],
    });
  }
}
