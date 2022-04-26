import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findOne(id: string) {
    return this.prisma.user.findFirst({ where: { id } });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async findOneByThirdPartyId(thirdPartyId: string) {
    return this.prisma.user.findFirst({
      where: {
        thirdPartyId,
      },
    });
  }

  findAll(filter: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany(filter);
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }
}
