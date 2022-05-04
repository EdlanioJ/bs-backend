import { Test, TestingModule } from '@nestjs/testing';
import { appointmentStub } from '../../../test/mocks/stubs';
import { PrismaService } from '../../prisma';
import { AppointmentRepository } from './appointment.repository';

describe('AppointmentRepository', () => {
  let repository: AppointmentRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentRepository, PrismaService],
    }).compile();

    repository = module.get<AppointmentRepository>(AppointmentRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should find findAvailable', async () => {
    const employeeId = 'employee_id';
    const start = new Date();
    const end = new Date();
    const appointment = appointmentStub();
    prisma.appointment.findFirst = jest.fn().mockResolvedValueOnce(appointment);
    const result = await repository.findAvailable(employeeId, start, end);
    expect(result).toBe(appointment);
  });
});
