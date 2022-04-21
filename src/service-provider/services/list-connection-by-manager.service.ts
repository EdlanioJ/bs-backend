import { Injectable } from '@nestjs/common';
import { ProviderConnectionRepository } from '../repositories/provider-connection.repository';
import { ServiceProviderRepository } from '../service-provider.repository';

@Injectable()
export class ListConnectionByManagerService {
  constructor(
    private readonly providerConnectionRepo: ProviderConnectionRepository,
    private readonly providerRepo: ServiceProviderRepository,
  ) {}

  async execute({
    userId,
    page,
    limit,
  }: {
    userId: string;
    page?: number;
    limit?: number;
  }) {
    const provider = await this.providerRepo.findByUserId(userId);

    return this.providerConnectionRepo.findAll({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        providerId: provider.id,
      },
    });
  }
}
