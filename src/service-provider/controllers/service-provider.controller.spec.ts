import { Test, TestingModule } from '@nestjs/testing';
import { serviceProviderStub } from '../../../test/stubs';
import { ServiceProviderModel } from '../models';
import {
  AddServiceProviderService,
  DeleteServiceProviderService,
  GetServiceProviderService,
} from '../services';
import { ServiceProviderController } from './index';

jest.mock('../services');

describe('ServiceProviderController', () => {
  let controller: ServiceProviderController;
  let addServiceProvider: AddServiceProviderService;
  let deleteServiceProvider: DeleteServiceProviderService;
  let getServiceProvider: GetServiceProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceProviderController],
      providers: [
        AddServiceProviderService,
        DeleteServiceProviderService,
        GetServiceProviderService,
      ],
    }).compile();

    controller = module.get<ServiceProviderController>(
      ServiceProviderController,
    );
    addServiceProvider = module.get<AddServiceProviderService>(
      AddServiceProviderService,
    );
    deleteServiceProvider = module.get<DeleteServiceProviderService>(
      DeleteServiceProviderService,
    );
    getServiceProvider = module.get<GetServiceProviderService>(
      GetServiceProviderService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('add service provider', () => {
    it('should call add service provider service with correct values', async () => {
      const name = 'name';
      const userId = 'userId';
      const spy = jest.spyOn(addServiceProvider, 'execute');
      await controller.add({ name }, userId);
      expect(spy).toHaveBeenCalledWith({ name, userId });
    });
  });

  describe('delete service provider', () => {
    it('should call delete service provider service with correct values', async () => {
      const id = 'id';
      const userId = 'userId';
      const spy = jest.spyOn(deleteServiceProvider, 'execute');
      await controller.delete(userId, id);
      expect(spy).toHaveBeenCalledWith({ id, userId });
    });
  });

  describe('get service provider', () => {
    it('should get service provider service return ServiceProviderModel', async () => {
      const serviceProvider = serviceProviderStub();
      const out = ServiceProviderModel.map(serviceProvider);
      const id = 'id';
      const spy = jest
        .spyOn(getServiceProvider, 'execute')
        .mockResolvedValue(out);
      const res = await controller.get(id);
      expect(spy).toHaveBeenCalledWith({ id });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(res).toBe(out);
    });
  });
});
