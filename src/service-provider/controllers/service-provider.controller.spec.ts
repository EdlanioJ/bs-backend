import { Test, TestingModule } from '@nestjs/testing';
import { AddServiceProviderService } from '../services/add-service-provider.service';
import { DeleteServiceProviderService } from '../services/delete-service-provider.service';
import { GetServiceProviderService } from '../services/get-service-provider.service';
import { ServiceProviderController } from './service-provider.controller';

jest.mock('../services/add-service-provider.service');
jest.mock('../services/delete-service-provider.service');
jest.mock('../services/get-service-provider.service');

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
