import { Test } from '@nestjs/testing';
import { UserRepository } from '../../user/repositories';
import {
  ProviderConnectionRepository,
  RequestConnectionRepository,
} from '../repositories';
import { AcceptConnectionService } from './accept-connection.service';

jest.mock('../../user/repositories');
jest.mock('../repositories');

describe('AcceptConnectionService', () => {
  let service: AcceptConnectionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AcceptConnectionService,
        UserRepository,
        ProviderConnectionRepository,
        RequestConnectionRepository,
      ],
    }).compile();
    service = module.get<AcceptConnectionService>(AcceptConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
