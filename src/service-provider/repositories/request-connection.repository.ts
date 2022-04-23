import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RequestConnectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProviderEmployeeConnectionRequestCreateInput) {
    return this.prisma.providerEmployeeConnectionRequest.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.ProviderEmployeeConnectionRequestUpdateInput,
  ) {
    return this.prisma.providerEmployeeConnectionRequest.update({
      where: { id },
      data,
    });
  }

  async findOne(id: string) {
    return this.prisma.providerEmployeeConnectionRequest.findFirst({
      where: { id },
    });
  }

  async delete(id: string) {
    return this.prisma.providerEmployeeConnectionRequest.delete({
      where: { id },
    });
  }

  async findAvailable(providerId: string, employeeId: string) {
    return this.prisma.providerEmployeeConnectionRequest.findFirst({
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
