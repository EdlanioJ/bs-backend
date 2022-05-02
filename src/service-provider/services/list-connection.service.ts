import { Injectable } from '@nestjs/common';

import { ProviderConnectionModel } from '../models';
import { ProviderConnectionRepository } from '../repositories';

type Input = {
  page: number;
  limit: number;
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

  async execute({ page, limit }: Input): Promise<Output> {
    const [total, providerConnections] = await Promise.all([
      this.providerConnectionRepo.count(),
      this.providerConnectionRepo.findAll({
        skip: Number((page - 1) * limit),
        take: Number(limit),
      }),
    ]);

    return {
      total,
      data: ProviderConnectionModel.mapCollection(providerConnections),
    };
  }
}
