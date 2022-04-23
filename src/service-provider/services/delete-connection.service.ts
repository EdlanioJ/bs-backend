import { Injectable, BadRequestException } from '@nestjs/common';
import {
  ProviderConnectionRepository,
  RequestConnectionRepository,
  ServiceProviderRepository,
} from '../repositories';

type Input = {
  connectionId: string;
  userId: string;
};

@Injectable()
export class DeleteConnectionService {
  constructor(
    private readonly providerRepo: ServiceProviderRepository,
    private readonly providerConnectionRepo: ProviderConnectionRepository,
    private readonly requestConnectionRepo: RequestConnectionRepository,
  ) {}

  async execute({ connectionId, userId }: Input): Promise<void> {
    const provider = await this.providerRepo.findByUserId(userId);
    if (!provider) throw new BadRequestException('Provider not found');

    const providerConnection = await this.providerConnectionRepo.findOne(
      connectionId,
    );

    if (!providerConnection)
      throw new BadRequestException('Connection not found');

    if (providerConnection.providerId !== provider.id)
      throw new BadRequestException('Connection not found');

    await this.providerConnectionRepo.delete(connectionId);

    const requestConnection = await this.requestConnectionRepo.findAvailable(
      provider.id,
      providerConnection.userId,
    );

    if (!requestConnection) return;

    await this.requestConnectionRepo.delete(requestConnection.id);
  }
}
