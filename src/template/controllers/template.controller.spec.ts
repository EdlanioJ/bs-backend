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
  let createTemplateService: CreateTemplateService;

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
    createTemplateService = module.get<CreateTemplateService>(
      CreateTemplateService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create template', () => {
    it('should call  create template service with correct values', async () => {
      const spy = jest.spyOn(createTemplateService, 'execute');
      await controller.create(
        {
          type: 'type',
          body: 'body',
          subject: 'subject',
        },
        'userId',
      );
      expect(spy).toHaveBeenCalledWith({
        type: 'type',
        body: 'body',
        subject: 'subject',
        userId: 'userId',
      });
    });
  });
});
