import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.TemplateCreateInput) {
    return this.prisma.template.create({
      data,
    });
  }

  update(id: string, data: Prisma.TemplateUpdateInput) {
    return this.prisma.template.update({
      where: {
        id,
      },
      data,
    });
  }

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

  count(args?: Prisma.TemplateCountArgs) {
    return this.prisma.template.count(args);
  }

  delete(id: string) {
    return this.prisma.template.delete({
      where: {
        id,
      },
    });
  }
}
