import { Test, TestingModule } from '@nestjs/testing';
import { createResponse } from 'node-mocks-http';
import { serviceStub } from '../../../test/stubs';
import { ServiceModel } from '../models';
import {
  CreateProviderServiceService,
  ListProviderServiceService,
  GetProviderServiceService,
} from '../services';
import { ServiceController } from './service.controller';

jest.mock('../services');

describe('ServiceController', () => {
  let controller: ServiceController;
  let createService: CreateProviderServiceService;
  let listService: ListProviderServiceService;
  let getService: GetProviderServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [
        CreateProviderServiceService,
        ListProviderServiceService,
        GetProviderServiceService,
      ],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
    createService = module.get<CreateProviderServiceService>(
      CreateProviderServiceService,
    );
    listService = module.get<ListProviderServiceService>(
      ListProviderServiceService,
    );
    getService = module.get<GetProviderServiceService>(
      GetProviderServiceService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call createService with correct params', async () => {
      const spy = jest.spyOn(createService, 'execute');
      await controller.create(
        {
          appointmentDurationInMinutes: 30,
          name: 'service_name',
        },
        'user_id',
      );
      expect(spy).toHaveBeenCalledWith({
        appointmentDurationInMinutes: 30,
        name: 'service_name',
        userId: 'user_id',
      });
    });
  });

  describe('list', () => {
    it('should listService return service list and total', async () => {
      const service = serviceStub();
      const result = {
        total: 1,
        data: [ServiceModel.map(service)],
      };
      const spy = jest
        .spyOn(listService, 'execute')
        .mockResolvedValueOnce(result);
      const res = createResponse();
      await controller.list(res);
      expect(spy).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        orderBy: 'createdAt',
        sort: 'desc',
      });
      expect(res.getHeader('x-total-count')).toBe(result.total);
      expect(res.getHeader('x-page')).toBe(1);
      expect(res.getHeader('x-limit')).toBe(10);
      const body = res._getJSONData();
      expect(body[0]).toEqual(
        expect.objectContaining({
          id: service.id,
          name: service.name,
          appointmentDurationInMinutes: service.appointmentDurationInMinutes,
        }),
      );
    });
  });

  describe('get', () => {
    it('should return service', async () => {
      const service = serviceStub();
      const result = ServiceModel.map(service);
      const spy = jest
        .spyOn(getService, 'execute')
        .mockResolvedValueOnce(result);
      const out = await controller.findOne(service.id);
      expect(spy).toHaveBeenCalledWith({ id: service.id });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(out).toEqual(result);
    });
  });
});
