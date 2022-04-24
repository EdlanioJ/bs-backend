import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateProviderServiceService,
  ListProviderServiceService,
  GetProviderServiceService,
} from '../services';
import { ServiceController } from './service.controller';

jest.mock('../services');

describe('ServiceController', () => {
  let controller: ServiceController;

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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
