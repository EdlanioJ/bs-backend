import { Injectable, BadRequestException } from '@nestjs/common';
import { SendMailProducerService } from '../../mail/services/send-mail-producer.service';
import { UserRepository } from '../../user/repository/user.repository';
import { RequestConnectionRepository } from '../repositories/request-connection.repository';
import { ServiceProviderRepository } from '../service-provider.repository';

@Injectable()
export class RequireConnectionService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly providerRepo: ServiceProviderRepository,
    private readonly requestConnectionRepo: RequestConnectionRepository,
    private readonly mailProducer: SendMailProducerService,
  ) {}

  async execute({
    providerOwnerId,
    userToConnectId,
  }: {
    providerOwnerId: string;
    userToConnectId: string;
  }) {
    const providerOwner = await this.userRepo.findOne(providerOwnerId);

    if (!providerOwner)
      throw new BadRequestException('Provider owner not found');

    if (providerOwner.role !== 'MANAGER')
      throw new BadRequestException('Only managers can connect users');

    const provider = await this.providerRepo.findByUserId(providerOwnerId);
    if (!provider) throw new BadRequestException('Provider not found');

    const userToConnect = await this.userRepo.findOne(userToConnectId);
    if (!userToConnect)
      throw new BadRequestException('User to connect not found');

    if (userToConnect.role !== 'USER')
      throw new BadRequestException('Only users can be connected');

    const checkAvailability = this.requestConnectionRepo.findAvailable(
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
      type: 'connection-request-email',
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
          key: 'connectionId',
          value: requestConnection.id,
        },
      ],
    });
  }
}
