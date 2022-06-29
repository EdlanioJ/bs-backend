import { Test } from '@nestjs/testing';
import { managerRequestStub } from '../../../test/stubs';
import { ManagerRequestModel } from '../models';
import { ManagerRequestRepository } from '../repositories';
import { ListManagerRequestService } from './list-manager-request.service';

jest.mock('../repositories');

describe('ListManagerRequestService', () => {
  let service: ListManagerRequestService;
  let managerRequestRepository: ManagerRequestRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ListManagerRequestService, ManagerRequestRepository],
    }).compile();

    service = module.get<ListManagerRequestService>(ListManagerRequestService);
    managerRequestRepository = module.get<ManagerRequestRepository>(
      ManagerRequestRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return manager requests and total', async () => {
    const page = 1;
    const limit = 10;
    const orderBy = 'id';
    const sort = 'asc';

    const managerRequest = managerRequestStub();
    const findSpy = jest
      .spyOn(managerRequestRepository, 'findAll')
      .mockResolvedValue([managerRequest]);
    const countSpy = jest
      .spyOn(managerRequestRepository, 'count')
      .mockResolvedValue(1);
    const result = await service.execute({ page, limit, orderBy, sort });
    expect(result).toEqual({
      total: 1,
      data: ManagerRequestModel.mapCollection([managerRequest]),
    });
    expect(findSpy).toHaveBeenCalledWith({
      skip: Number((page - 1) * limit),
      take: Number(limit),
      orderBy: {
        [orderBy]: sort,
      },
    });
    expect(countSpy).toHaveBeenCalledTimes(1);
  });
});
