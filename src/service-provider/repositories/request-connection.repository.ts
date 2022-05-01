import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma';

@Injectable()
export class RequestConnectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProviderConnectionRequestCreateInput) {
    return this.prisma.providerConnectionRequest.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ProviderConnectionRequestUpdateInput) {
    return this.prisma.providerConnectionRequest.update({
      where: { id },
      data,
    });
  }

  async findOne(id: string) {
    return this.prisma.providerConnectionRequest.findFirst({
      where: { id },
    });
  }

  async delete(id: string) {
    return this.prisma.providerConnectionRequest.delete({
      where: { id },
    });
  }

  async findAvailable(providerId: string, employeeId: string) {
    return this.prisma.providerConnectionRequest.findFirst({
      where: {
        provider: { id: providerId },
        employee: { id: employeeId },
        status: {
          in: ['PENDING', 'ACCEPTED'],
        },
      },
    });
  }
}
