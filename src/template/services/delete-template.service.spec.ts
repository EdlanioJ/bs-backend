import { Test } from '@nestjs/testing';
import { TemplateRepository } from '../repositories';
import { DeleteTemplateService } from './delete-template.service';

jest.mock('../repositories');

describe('DeleteTemplateService', () => {
  let service: DeleteTemplateService;
  let templateRepo: TemplateRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DeleteTemplateService, TemplateRepository],
    }).compile();

    service = module.get<DeleteTemplateService>(DeleteTemplateService);
    templateRepo = module.get<TemplateRepository>(TemplateRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete a template', async () => {
    const id = 'any_id';
    const spy = jest.spyOn(templateRepo, 'delete');
    await service.execute({ id });
    expect(spy).toHaveReturnedTimes(1);
    expect(spy).toHaveBeenCalledWith(id);
  });
});
