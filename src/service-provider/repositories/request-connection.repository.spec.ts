import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma';
import { RequestConnectionRepository } from './request-connection.repository';

describe('RequestConnectionRepository', () => {
  let repository: RequestConnectionRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RequestConnectionRepository, PrismaService],
    }).compile();

    repository = module.get<RequestConnectionRepository>(
      RequestConnectionRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
