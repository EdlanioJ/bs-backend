import { Test, TestingModule } from '@nestjs/testing';

import { TemplateController } from './template.controller';

import {
  CreateTemplateService,
  DeleteTemplateService,
  GetTemplateService,
  ListTemplateService,
} from '../services';

jest.mock('../services');

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
