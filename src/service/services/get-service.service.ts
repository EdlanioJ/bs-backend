import { Injectable } from '@nestjs/common';

import { ServiceModel } from '../models';
import { ServiceRepository } from '../repositories';

type Input = {
  id: string;
};

type Output = ServiceModel;

@Injectable()
export class GetProviderServiceService {
  constructor(private readonly serviceRepo: ServiceRepository) {}
  async execute({ id }: Input): Promise<Output> {
    const service = await this.serviceRepo.findOne(id);

    return ServiceModel.map(service);
  }
}
