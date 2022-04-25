import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma';

@Injectable()
export class ManagerRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ManagerRequestCreateInput) {
    return this.prisma.managerRequest.create({ data });
  }

  async update(id: string, data: Prisma.ManagerRequestUpdateInput) {
    return this.prisma.managerRequest.update({
      where: { id },
      data,
    });
  }

  async findAvailable(userId: string) {
    return this.prisma.managerRequest.findFirst({
      where: {
        userId,
        status: 'PENDING',
      },
    });
  }
}
