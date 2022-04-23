import { Test, TestingModule } from '@nestjs/testing';

import { TemplateController } from './template.controller';

import { CreateTemplateService } from '../services/create-template.service';
import { DeleteTemplateService } from '../services/delete-template.service';
import { GetTemplateService } from '../services/get-template.service';
import { ListTemplateService } from '../services/list-template.service';

jest.mock('../services/create-template.service');
jest.mock('../services/delete-template.service');
jest.mock('../services/get-template.service');
jest.mock('../services/list-template.service');

describe('TemplateController', () => {
  let controller: TemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [
        CreateTemplateService,
        DeleteTemplateService,
        GetTemplateService,
        ListTemplateService,
      ],
    }).compile();

    controller = module.get<TemplateController>(TemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
