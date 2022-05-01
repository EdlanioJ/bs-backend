import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma';

@Injectable()
export class ProviderConnectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProviderConnectionCreateInput) {
    return this.prisma.providerConnection.create({
      data,
    });
  }

  async findOne(id: string) {
    return this.prisma.providerConnection.findFirst({
      where: {
        id,
      },
    });
  }

  async findAll(filter: Prisma.ProviderConnectionFindManyArgs) {
    return this.prisma.providerConnection.findMany(filter);
  }

  async count(args?: Prisma.ProviderConnectionCountArgs) {
    return this.prisma.providerConnection.count(args);
  }
  async delete(id: string) {
    return this.prisma.providerConnection.delete({
      where: {
        id,
      },
    });
  }
}
