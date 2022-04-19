import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: string) {
    return this.prisma.template.findFirst({
      where: {
        id,
      },
    });
  }

  findOneByType(type: string) {
    return this.prisma.template.findFirst({
      where: {
        type,
      },
    });
  }

  findAll(filter: Prisma.TemplateFindManyArgs) {
    return this.prisma.template.findMany(filter);
  }

  update(id: string, data: Prisma.TemplateUpdateInput) {
    return this.prisma.template.update({
      where: {
        id,
      },
      data,
    });
  }

  create(data: Prisma.TemplateCreateInput) {
    return this.prisma.template.create({
      data,
    });
  }

  delete(id: string) {
    return this.prisma.template.delete({
      where: {
        id,
      },
    });
  }
}
