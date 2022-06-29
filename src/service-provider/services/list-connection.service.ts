import { Injectable } from '@nestjs/common';

import { ProviderConnectionModel } from '../models';
import { ProviderConnectionRepository } from '../repositories';

type Input = {
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
export class ListConnectionService {
  constructor(
    private readonly providerConnectionRepo: ProviderConnectionRepository,
  ) {}

  async execute({ page, limit, orderBy, sort }: Input): Promise<Output> {
    const [total, providerConnections] = await Promise.all([
      this.providerConnectionRepo.count(),
      this.providerConnectionRepo.findAll({
        skip: Number((page - 1) * limit),
        take: Number(limit),
        orderBy: {
          [orderBy]: sort,
        },
      }),
    ]);

    return {
      total,
      data: ProviderConnectionModel.mapCollection(providerConnections),
    };
  }
}
