import { BadRequestException, Injectable } from '@nestjs/common';
import { ProviderConnectionModel } from '../models/connection-provider.model';
import {
  ProviderConnectionRepository,
  ServiceProviderRepository,
} from '../repositories';

type Input = {
  userId: string;
  page: number;
  limit: number;
};

type Output = {
  total: number;
  data: ProviderConnectionModel[];
};

@Injectable()
export class ListConnectionByManagerService {
  constructor(
    private readonly providerConnectionRepo: ProviderConnectionRepository,
    private readonly providerRepo: ServiceProviderRepository,
  ) {}

  async execute({ userId, page, limit }: Input): Promise<Output> {
    const provider = await this.providerRepo.findByUserId(userId);

    if (!provider) throw new BadRequestException('user has not a provider');

    const [total, providerConnections] = await Promise.all([
      this.providerConnectionRepo.count({
        where: { providerId: provider.id },
      }),
      this.providerConnectionRepo.findAll({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          providerId: provider.id,
        },
      }),
    ]);

    return {
      total,
      data: ProviderConnectionModel.mapCollection(providerConnections),
    };
  }
}
