import { Injectable, BadRequestException } from '@nestjs/common';
import { ProviderConnectionRepository } from '../repositories/provider-connection.repository';
import { RequestConnectionRepository } from '../repositories/request-connection.repository';
import { ServiceProviderRepository } from '../service-provider.repository';

@Injectable()
export class DeleteConnectionService {
  constructor(
    private readonly providerRepo: ServiceProviderRepository,
    private readonly providerConnectionRepo: ProviderConnectionRepository,
    private readonly requestConnectionRepo: RequestConnectionRepository,
  ) {}

  async execute({
    connectionId,
    userId,
  }: {
    connectionId: string;
    userId: string;
  }) {
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
