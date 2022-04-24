import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ServiceCreateInput) {
    return this.prisma.service.create({
      data,
    });
  }

  async findAll(filter: Prisma.ServiceFindManyArgs) {
    return this.prisma.service.findMany(filter);
  }

  async count(args?: Prisma.ServiceCountArgs) {
    return this.prisma.service.count(args);
  }
  async findOne(id: string) {
    return this.prisma.service.findFirst({
      where: {
        id,
      },
    });
  }
}
