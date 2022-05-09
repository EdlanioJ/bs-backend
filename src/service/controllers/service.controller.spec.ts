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
  let createService: CreateProviderServiceService;

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
});
