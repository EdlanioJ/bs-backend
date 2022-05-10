import { Test, TestingModule } from '@nestjs/testing';
import {
  AddServiceProviderService,
  DeleteServiceProviderService,
  GetServiceProviderService,
} from '../services';
import { ServiceProviderController } from './service-provider.controller';

jest.mock('../services');

describe('ServiceProviderController', () => {
  let controller: ServiceProviderController;
  let addServiceProvider: AddServiceProviderService;

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
});
