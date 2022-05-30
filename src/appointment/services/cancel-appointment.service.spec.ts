import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CancelAppointmentService } from './cancel-appointment.service';
import { AppointmentRepository } from '../repositories';
import { appointmentStub } from '../../../test/stubs';

jest.mock('../repositories');

describe('CancelAppointmentService', () => {
  let service: CancelAppointmentService;
  let appointmentRepo: AppointmentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CancelAppointmentService, AppointmentRepository],
    }).compile();

    service = module.get<CancelAppointmentService>(CancelAppointmentService);
    appointmentRepo = module.get<AppointmentRepository>(AppointmentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const input = {
    appointmentId: 'any_appointment_id',
    reason: 'any_reason',
    userId: 'any_user_id',
  };

  it('should throw if appointment repository findOne return null', () => {
    const spy = jest.spyOn(appointmentRepo, 'findOne').mockResolvedValue(null);
    const output = service.execute(input);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(input.appointmentId);
    expect(output).rejects.toThrowError(
      new UnauthorizedException('Appointment not found'),
    );
  });

  it('should throw if userId is different than customerId', () => {
    jest.spyOn(appointmentRepo, 'findOne').mockResolvedValue(appointmentStub());
    const output = service.execute(input);
    expect(output).rejects.toThrowError(
      new UnauthorizedException('User is not the customer'),
    );
  });

  it('should throw if appointment is already cancelled', () => {
    jest.spyOn(appointmentRepo, 'findOne').mockResolvedValue({
      ...appointmentStub(),
      status: 'CANCELLED',
      customerId: input.userId,
    });

    const output = service.execute(input);
    expect(output).rejects.toThrowError(
      new BadRequestException('Appointment is already cancelled'),
    );
  });

  it('should throw BadRequestException if appointment is already completed', () => {
    jest.spyOn(appointmentRepo, 'findOne').mockResolvedValue({
      ...appointmentStub(),
      status: 'COMPLETED',
      customerId: input.userId,
    });

    const output = service.execute(input);
    expect(output).rejects.toThrowError(
      new BadRequestException('Appointment is already completed'),
    );
  });

  it('should successfully cancel appointment', async () => {
    jest.spyOn(appointmentRepo, 'findOne').mockResolvedValue({
      ...appointmentStub(),
      customerId: input.userId,
    });

    const spy = jest.spyOn(appointmentRepo, 'update').mockResolvedValue(null);

    await service.execute(input);
    expect(spy).toBeCalledTimes(1);
  });
});
