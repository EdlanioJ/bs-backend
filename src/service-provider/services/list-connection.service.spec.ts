import { Test } from '@nestjs/testing';
import { providerConnectionStub } from '../../../test/mocks/stubs';
import { ProviderConnectionModel } from '../models';
import { ProviderConnectionRepository } from '../repositories';
import { ListConnectionService } from './list-connection.service';

jest.mock('../repositories');

describe('ListConnectionService', () => {
  let service: ListConnectionService;
  let providerConnectionRepo: ProviderConnectionRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ListConnectionService, ProviderConnectionRepository],
    }).compile();
    service = module.get<ListConnectionService>(ListConnectionService);
    providerConnectionRepo = module.get<ProviderConnectionRepository>(
      ProviderConnectionRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list connections and total', async () => {
    const page = 1;
    const limit = 10;
    const providerConnection = providerConnectionStub();
    const findSpy = jest
      .spyOn(providerConnectionRepo, 'findAll')
      .mockResolvedValueOnce([providerConnection]);
    const countSpy = jest
      .spyOn(providerConnectionRepo, 'count')
      .mockResolvedValueOnce(1);
    const out = await service.execute({ page, limit });
    expect(out.total).toBe(1);
    expect(out.data).toHaveLength(1);
    expect(out.data[0]).toEqual(
      ProviderConnectionModel.map(providerConnection),
    );
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(countSpy).toHaveBeenCalledTimes(1);
  });
});
