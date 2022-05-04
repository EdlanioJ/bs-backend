import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma';
import { AppointmentRepository } from './appointment.repository';

jest.mock('../../prisma');

describe('AppointmentRepository', () => {
  let repository: AppointmentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentRepository, PrismaService],
    }).compile();

    repository = module.get<AppointmentRepository>(AppointmentRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
