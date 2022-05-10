import { Test } from '@nestjs/testing';
import { templateStub } from '../../../test/mocks/stubs';
import { TemplateModel } from '../models';
import { TemplateRepository } from '../repositories';
import { ListTemplateService } from './list-template.service';

jest.mock('../repositories');

describe('ListTemplateService', () => {
  let service: ListTemplateService;
  let templateRepo: TemplateRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ListTemplateService, TemplateRepository],
    }).compile();
    service = module.get<ListTemplateService>(ListTemplateService);
    templateRepo = module.get<TemplateRepository>(TemplateRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of templates', async () => {
    const templates = [templateStub()];
    const page = 1;
    const limit = 10;
    const findSpy = jest
      .spyOn(templateRepo, 'findAll')
      .mockResolvedValue(templates);
    const countSpy = jest
      .spyOn(templateRepo, 'count')
      .mockResolvedValue(templates.length);
    const result = await service.execute({ limit, page });
    expect(findSpy).toHaveBeenCalledWith({
      skip: (page - 1) * limit,
      take: limit,
    });
    expect(countSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      total: templates.length,
      data: TemplateModel.mapCollection(templates),
    });
  });
});
