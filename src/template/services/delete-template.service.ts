import { Injectable } from '@nestjs/common';
import { TemplateRepository } from '../repositories/template.repository';

type Input = {
  id: string;
};

@Injectable()
export class DeleteTemplateService {
  constructor(private readonly templateRepo: TemplateRepository) {}

  async execute({ id }: Input): Promise<void> {
    await this.templateRepo.delete(id);
  }
}
