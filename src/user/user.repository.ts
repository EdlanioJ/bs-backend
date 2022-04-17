import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findOne(id: string) {
    return this.prisma.user.findFirst({ where: { id } });
  }
}
