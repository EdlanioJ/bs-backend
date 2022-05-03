import { Test, TestingModule } from '@nestjs/testing';
import { CompleteAppointmentService } from './complete-appointment.service';
import { AppointmentRepository } from '../repositories';
import { UnauthorizedException } from '@nestjs/common';

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
});
