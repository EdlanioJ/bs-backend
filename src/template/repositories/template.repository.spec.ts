import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma';
import { TemplateRepository } from './template.repository';

describe('TemplateRepository', () => {
  let repository: TemplateRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TemplateRepository, PrismaService],
    }).compile();
    repository = module.get<TemplateRepository>(TemplateRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
