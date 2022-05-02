import { Injectable } from '@nestjs/common';
import { ManagerRequestModel } from '../models';
import { ManagerRequestRepository } from '../repositories';

type Input = {
  page: number;
  limit: number;
};

type Output = {
  total: number;
  data: ManagerRequestModel[];
};

@Injectable()
export class ListManagerRequestService {
  constructor(private readonly managerRequestRepo: ManagerRequestRepository) {}

  async execute({ limit, page }: Input): Promise<Output> {
    const [total, requests] = await Promise.all([
      this.managerRequestRepo.count(),
      this.managerRequestRepo.findAll({
        skip: Number((page - 1) * limit),
        take: Number(limit),
      }),
    ]);

    return {
      total,
      data: ManagerRequestModel.mapCollection(requests),
    };
  }
}
