import { Injectable } from '@nestjs/common';
import { ServiceModel } from '../models/service.model';
import { ServiceRepository } from '../repositories';

type Input = {
  page: number;
  limit: number;
};

type Output = {
  total: number;
  data: ServiceModel[];
};
@Injectable()
export class ListProviderServiceService {
  constructor(private readonly serviceRepo: ServiceRepository) {}
  async execute({ limit, page }: Input): Promise<Output> {
    const [total, services] = await Promise.all([
      this.serviceRepo.count(),
      this.serviceRepo.findAll({
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      total,
      data: ServiceModel.mapCollection(services),
    };
  }
}
