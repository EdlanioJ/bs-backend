import { Test } from '@nestjs/testing';
import { TemplateRepository } from '../repositories';
import { GetTemplateService } from './get-template.service';

jest.mock('../repositories');

describe('GetTemplateService', () => {
  let service: GetTemplateService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetTemplateService, TemplateRepository],
    }).compile();
    service = module.get<GetTemplateService>(GetTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
