import { Injectable } from '@nestjs/common';
import { ProviderConnectionRepository } from '../repositories/provider-connection.repository';

@Injectable()
export class ListConnectionService {
  constructor(
    private readonly providerConnectionRepo: ProviderConnectionRepository,
  ) {}

  async execute({ page, limit }: { page?: number; limit?: number }) {
    return this.providerConnectionRepo.findAll({
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
