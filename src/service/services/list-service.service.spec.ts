import { Test } from '@nestjs/testing';
import { serviceStub } from '../../../test/stubs';
import { ServiceRepository } from '../repositories';
import { ListProviderServiceService } from './list-service.service';

jest.mock('../repositories');

describe('ListProviderServiceService', () => {
  let service: ListProviderServiceService;
  let serviceRepo: ServiceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ListProviderServiceService, ServiceRepository],
    }).compile();
    service = module.get<ListProviderServiceService>(
      ListProviderServiceService,
    );
    serviceRepo = module.get<ServiceRepository>(ServiceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return list of services', async () => {
    const countSpy = jest.spyOn(serviceRepo, 'count').mockResolvedValue(1);
    const spy = jest
      .spyOn(serviceRepo, 'findAll')
      .mockResolvedValueOnce([serviceStub()]);
    const result = await service.execute({
      page: 1,
      limit: 1,
      orderBy: 'createdAt',
      sort: 'desc',
    });
    expect(spy).toHaveBeenCalledWith({
      skip: 0,
      take: 1,
      orderBy: {
        createdAt: 'desc',
      },
    });
    expect(result).toBeDefined();
    expect(countSpy).toHaveBeenCalledTimes(1);
    expect(result.total).toBe(1);
    expect(result.data).toHaveLength(1);
  });
});
