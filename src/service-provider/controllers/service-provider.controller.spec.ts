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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
