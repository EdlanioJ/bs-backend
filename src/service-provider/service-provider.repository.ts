import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceProviderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ServiceProviderCreateInput) {
    return this.prisma.serviceProvider.create({
      data,
    });
  }

  async findOne(id: string) {
    return this.prisma.serviceProvider.findFirst({
      where: {
        id,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.serviceProvider.findFirst({
      where: {
        userId: userId,
      },
    });
  }

  async delete(id: string, userId: string) {
    return this.prisma.serviceProvider.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
