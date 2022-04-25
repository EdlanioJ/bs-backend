import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma';

@Injectable()
export class ProviderConnectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProviderEmployeeConnectionCreateInput) {
    return this.prisma.providerEmployeeConnection.create({
      data,
    });
  }

  async findOne(id: string) {
    return this.prisma.providerEmployeeConnection.findFirst({
      where: {
        id,
      },
    });
  }

  async findAll(filter: Prisma.ProviderEmployeeConnectionFindManyArgs) {
    return this.prisma.providerEmployeeConnection.findMany(filter);
  }

  async count(args?: Prisma.ProviderEmployeeConnectionCountArgs) {
    return this.prisma.providerEmployeeConnection.count(args);
  }
  async delete(id: string) {
    return this.prisma.providerEmployeeConnection.delete({
      where: {
        id,
      },
    });
  }
}
