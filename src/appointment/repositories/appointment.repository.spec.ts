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

  it('should create new appointment', async () => {
    const appointment = appointmentStub();

    prisma.appointment.create = jest.fn().mockResolvedValueOnce(appointment);
    const result = await repository.create({
      id: 'appointment_id',
      customer: { connect: { id: 'customer_id' } },
      employee: { connect: { id: 'employee_id' } },
      start: new Date(),
      end: new Date(),
      status: 'PENDING',
      service: { connect: { id: 'service_id' } },
      createdAt: new Date(),
    });
    expect(result).toBe(appointment);
  });
  it('should update appointment', async () => {
    const appointment = appointmentStub();
    const id = 'appointment_id';
    prisma.appointment.update = jest.fn().mockResolvedValueOnce(appointment);
    const result = await repository.update(id, {
      status: 'COMPLETED',
    });
    expect(result).toBe(appointment);
  });

  it('should find one appointment', async () => {
    const appointment = appointmentStub();
    const id = 'appointment_id';
    prisma.appointment.findFirst = jest.fn().mockResolvedValueOnce(appointment);
    const result = await repository.findOne(id);
    expect(result).toBe(appointment);
  });

  it('should count appointments', async () => {
    prisma.appointment.count = jest.fn().mockResolvedValueOnce(1);
    const result = await repository.count();
    expect(result).toBe(1);
  });

  it('should find all appointments', async () => {
    const appointments = [appointmentStub()];
    prisma.appointment.findMany = jest.fn().mockResolvedValueOnce(appointments);
    const result = await repository.findAll({
      where: {
        status: 'PENDING',
      },
    });
    expect(result).toBe(appointments);
  });
});
