import { Test, TestingModule } from '@nestjs/testing';
import { ServiceProviderController } from './service-provider.controller';

describe('ServiceProviderController', () => {
  let controller: ServiceProviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceProviderController],
    }).compile();

    controller = module.get<ServiceProviderController>(ServiceProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
