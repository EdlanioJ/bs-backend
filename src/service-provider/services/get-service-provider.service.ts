import { Injectable } from '@nestjs/common';

import { ServiceProviderModel } from '../models';
import { ServiceProviderRepository } from '../repositories';

type Input = {
  id: string;
};

@Injectable()
export class GetServiceProviderService {
  constructor(private readonly providerRepo: ServiceProviderRepository) {}
  async execute({ id }: Input): Promise<ServiceProviderModel> {
    const provider = await this.providerRepo.findOne(id);

    return ServiceProviderModel.map(provider);
  }
}
