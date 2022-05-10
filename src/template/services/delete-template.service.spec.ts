import { Test } from '@nestjs/testing';
import { TemplateRepository } from '../repositories';
import { DeleteTemplateService } from './delete-template.service';

jest.mock('../repositories');

describe('DeleteTemplateService', () => {
  let service: DeleteTemplateService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DeleteTemplateService, TemplateRepository],
    }).compile();

    service = module.get<DeleteTemplateService>(DeleteTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
