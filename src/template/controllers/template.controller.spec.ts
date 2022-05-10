import { Test, TestingModule } from '@nestjs/testing';

import { TemplateController } from './template.controller';

import {
  CreateTemplateService,
  DeleteTemplateService,
  GetTemplateService,
  ListTemplateService,
} from '../services';
import { templateStub } from '../../../test/mocks/stubs';
import { TemplateModel } from '../models';

jest.mock('../services');

const template = templateStub();

describe('TemplateController', () => {
  let controller: TemplateController;
  let createTemplateService: CreateTemplateService;
  let deleteTemplateService: DeleteTemplateService;
  let getTemplateService: GetTemplateService;

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
    deleteTemplateService = module.get<DeleteTemplateService>(
      DeleteTemplateService,
    );
    getTemplateService = module.get<GetTemplateService>(GetTemplateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create template', () => {
    it('should call create template service with correct values', async () => {
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

  describe('delete template', () => {
    it('should call delete template service with correct values', async () => {
      const spy = jest.spyOn(deleteTemplateService, 'execute');
      await controller.delete('templateId');
      expect(spy).toHaveBeenCalledWith({ id: 'templateId' });
    });
  });

  describe('get template', () => {
    it('should get template service return TemplateModel', async () => {
      const spy = jest
        .spyOn(getTemplateService, 'execute')
        .mockResolvedValue(TemplateModel.map(template));
      const result = await controller.get('templateId');
      expect(spy).toHaveBeenCalledWith({ id: 'templateId' });
      expect(result).toEqual(TemplateModel.map(template));
    });
  });
});
