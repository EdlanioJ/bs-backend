import { Test } from '@nestjs/testing';
import { serviceStub } from '../../../test/mocks/stubs';
import { PrismaService } from '../../prisma';
import { ServiceRepository } from './service.repository';

describe('ServiceRepository', () => {
  let repository: ServiceRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServiceRepository, PrismaService],
    }).compile();
    repository = module.get<ServiceRepository>(ServiceRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create new service', async () => {
    const service = serviceStub();
    prisma.service.create = jest.fn().mockResolvedValueOnce(service);
    const result = await repository.create({
      id: 'service_id',
      name: 'service_name',
      provider: { connect: { id: 'provider_id' } },
      createdAt: new Date(),
      appointmentDurationInMinutes: 30,
    });
    expect(result).toBe(service);
  });
});
