import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { CancelAppointmentService } from './cancel-appointment.service';
import { AppointmentRepository } from '../repositories';

jest.mock('../repositories', () =>
  jest.requireActual('../../../test/mocks/repositories/appointment.mock'),
);

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

    expect(spy).toBeCalled();
    expect(spy).toBeCalledWith(input.appointmentId);
    expect(output).rejects.toThrowError(
      new UnauthorizedException('Appointment not found'),
    );
  });
});
