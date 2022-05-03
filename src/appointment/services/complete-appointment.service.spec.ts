import { Test, TestingModule } from '@nestjs/testing';
import { CompleteAppointmentService } from './complete-appointment.service';
import { AppointmentRepository } from '../repositories';

jest.mock('../repositories');

describe('CompleteAppointmentService', () => {
  let service: CompleteAppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompleteAppointmentService, AppointmentRepository],
    }).compile();

    service = module.get<CompleteAppointmentService>(
      CompleteAppointmentService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
