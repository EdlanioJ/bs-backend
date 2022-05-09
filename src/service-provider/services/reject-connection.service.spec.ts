import { Test } from '@nestjs/testing';
import { UserRepository } from '../../user/repositories';
import { RequestConnectionRepository } from '../repositories';
import { RejectConnectionService } from './reject-connection.service';

jest.mock('../repositories');
jest.mock('../../user/repositories');

describe('RejectConnectionService', () => {
  let service: RejectConnectionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RejectConnectionService,
        UserRepository,
        RequestConnectionRepository,
      ],
    }).compile();

    service = module.get<RejectConnectionService>(RejectConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
