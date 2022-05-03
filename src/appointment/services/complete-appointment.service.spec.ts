import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CompleteAppointmentService } from './complete-appointment.service';
import { AppointmentRepository } from '../repositories';
import { appointmentStub } from '../../../test/mocks/stubs';
import faker from '@faker-js/faker';

jest.mock('../repositories', () =>
  jest.requireActual('../../../test/mocks/repositories/appointment.mock'),
);

describe('CompleteAppointmentService', () => {
  let service: CompleteAppointmentService;
  let appointmentRepo: AppointmentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompleteAppointmentService, AppointmentRepository],
    }).compile();

    service = module.get<CompleteAppointmentService>(
      CompleteAppointmentService,
    );
    appointmentRepo = module.get<AppointmentRepository>(AppointmentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const input = { appointmentId: 'any_appointment_id', userId: 'any_user_id' };

  it('should throw UnauthorizedException if appointment repo findOne method returns null', () => {
    const spy = jest.spyOn(appointmentRepo, 'findOne').mockResolvedValue(null);
    const output = service.execute(input);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(input.appointmentId);
    expect(output).rejects.toThrowError(
      new UnauthorizedException('Appointment not found'),
    );
  });

  it('should throw UnauthorizedException if appointment employeeId is different than userId', () => {
    jest.spyOn(appointmentRepo, 'findOne').mockResolvedValue(appointmentStub());
    const output = service.execute(input);
    expect(output).rejects.toThrowError(
      new UnauthorizedException('User is not the employee'),
    );
  });

  it('should throw UnauthorizedException if appointment status is "COMPLETED"', () => {
    jest.spyOn(appointmentRepo, 'findOne').mockResolvedValue({
      ...appointmentStub(),
      status: 'COMPLETED',
      employeeId: input.userId,
    });
    const output = service.execute(input);
    expect(output).rejects.toThrowError(
      new BadRequestException('Appointment is already completed'),
    );
  });

  it('should throw UnauthorizedException if appointment status is "CANCELLED"', () => {
    jest.spyOn(appointmentRepo, 'findOne').mockResolvedValue({
      ...appointmentStub(),
      status: 'CANCELLED',
      employeeId: input.userId,
    });
    const output = service.execute(input);
    expect(output).rejects.toThrowError(
      new BadRequestException('Appointment is cancelled'),
    );
  });

  it('should throw BadRequestException if appointment state time is in past', () => {
    jest.spyOn(appointmentRepo, 'findOne').mockResolvedValue({
      ...appointmentStub(),
      start: faker.date.past(),
      employeeId: input.userId,
    });
    const output = service.execute(input);
    expect(output).rejects.toThrowError(
      new BadRequestException('Appointment cannot be in the past'),
    );
  });

  it('should successfully complete appointment', async () => {
    jest.spyOn(appointmentRepo, 'findOne').mockResolvedValue({
      ...appointmentStub(),
      start: faker.date.future(),
      employeeId: input.userId,
    });
    const spy = jest.spyOn(appointmentRepo, 'update');
    await service.execute(input);
    expect(spy).toBeCalledTimes(1);
  });
});
