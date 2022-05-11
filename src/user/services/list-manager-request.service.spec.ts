import { Test } from '@nestjs/testing';
import { ManagerRequestRepository } from '../repositories';
import { ListManagerRequestService } from './list-manager-request.service';

jest.mock('../repositories');

describe('ListManagerRequestService', () => {
  let service: ListManagerRequestService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ListManagerRequestService, ManagerRequestRepository],
    }).compile();

    service = module.get<ListManagerRequestService>(ListManagerRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
