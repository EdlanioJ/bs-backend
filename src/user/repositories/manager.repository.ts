import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma';

@Injectable()
export class ManagerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ManagerCreateInput) {
    return this.prisma.manager.create({
      data,
    });
  }
}
