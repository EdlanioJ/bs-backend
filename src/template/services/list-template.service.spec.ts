import { Test } from '@nestjs/testing';
import { TemplateRepository } from '../repositories';
import { ListTemplateService } from './list-template.service';

jest.mock('../repositories');

describe('ListTemplateService', () => {
  let service: ListTemplateService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ListTemplateService, TemplateRepository],
    }).compile();
    service = module.get<ListTemplateService>(ListTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
