import { BadRequestException, Injectable } from '@nestjs/common';

import { ProviderConnectionModel } from '../models';
import {
  ProviderConnectionRepository,
  ServiceProviderRepository,
} from '../repositories';

type Input = {
  userId: string;
  page: number;
  limit: number;
  orderBy?: string;
  sort?: string;
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

  async execute({
    userId,
    page,
    limit,
    orderBy,
    sort,
  }: Input): Promise<Output> {
    const provider = await this.providerRepo.findByUserId(userId);

    if (!provider) throw new BadRequestException('user has not a provider');

    const [total, providerConnections] = await Promise.all([
      this.providerConnectionRepo.count({
        where: { providerId: provider.id },
      }),
      this.providerConnectionRepo.findAll({
        skip: Number((page - 1) * limit),
        take: Number(limit),
        orderBy: {
          [orderBy]: sort,
        },
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
