import { Test } from '@nestjs/testing';
import { templateStub } from '../../../test/mocks/stubs';
import { TemplateModel } from '../models';
import { TemplateRepository } from '../repositories';
import { GetTemplateService } from './get-template.service';

jest.mock('../repositories');

describe('GetTemplateService', () => {
  let service: GetTemplateService;
  let templateRepo: TemplateRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetTemplateService, TemplateRepository],
    }).compile();
    service = module.get<GetTemplateService>(GetTemplateService);
    templateRepo = module.get<TemplateRepository>(TemplateRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a template', async () => {
    const template = templateStub();
    const spy = jest.spyOn(templateRepo, 'findOne').mockResolvedValue(template);
    const result = await service.execute({ id: template.id });
    expect(spy).toHaveBeenCalledWith(template.id);
    expect(result).toEqual(TemplateModel.map(template));
  });
});
