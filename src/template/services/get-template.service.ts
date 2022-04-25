import { Injectable } from '@nestjs/common';
import { TemplateModel } from '../models/template.model';
import { TemplateRepository } from '../repositories';

type Input = {
  id: string;
};

type Output = TemplateModel;

@Injectable()
export class GetTemplateService {
  constructor(private readonly templateRepo: TemplateRepository) {}

  async execute({ id }: Input): Promise<Output> {
    const template = await this.templateRepo.findOne(id);

    return TemplateModel.map(template);
  }
}
