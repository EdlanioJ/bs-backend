import { Test } from '@nestjs/testing';
import { UserRepository } from '../../user/repositories';
import { TemplateRepository } from '../repositories';
import { CreateTemplateService } from './create-template.service';

jest.mock('../repositories');
jest.mock('../../user/repositories');

describe('CreateTemplateService', () => {
  let service: CreateTemplateService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CreateTemplateService, UserRepository, TemplateRepository],
    }).compile();
    service = module.get<CreateTemplateService>(CreateTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
