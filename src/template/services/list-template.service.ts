import { Injectable } from '@nestjs/common';
import { TemplateRepository } from '../repositories';
import { TemplateModel } from '../models';

type Input = {
  page: number;
  limit: number;
  orderBy?: string;
  sort?: string;
};

type Output = {
  total: number;
  data: TemplateModel[];
};

@Injectable()
export class ListTemplateService {
  constructor(private readonly templateRepo: TemplateRepository) {}

  async execute({ page, limit, orderBy, sort }: Input): Promise<Output> {
    const [total, templates] = await Promise.all([
      this.templateRepo.count(),
      this.templateRepo.findAll({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          [orderBy]: sort,
        },
      }),
    ]);

    return { total, data: TemplateModel.mapCollection(templates) };
  }
}
