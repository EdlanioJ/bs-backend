import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { ServiceProviderModel } from '../models';

type Input = {
  page: number;
  limit: number;
  orderBy?: string;
  sort?: string;
};

type Output = {
  total: number;
  data: ServiceProviderModel[];
};

@Injectable()
export class ListProviderService {
  constructor(private readonly prisma: PrismaService) {}
  async execute({ limit, page, orderBy, sort }: Input): Promise<Output> {
    const [total, serviceProvider] = await Promise.all([
      this.prisma.serviceProvider.count(),
      this.prisma.serviceProvider.findMany({
        skip: Number((page - 1) * limit),
        take: Number(limit),
        orderBy: {
          [orderBy]: sort,
        },
      }),
    ]);
    return {
      total,
      data: serviceProvider.map(ServiceProviderModel.map),
    };
  }
}
