import { Test, TestingModule } from '@nestjs/testing';

import { CancelAppointmentService } from './cancel-appointment.service';
import { AppointmentRepository } from '../repositories';

jest.mock('../repositories');

describe('CancelAppointmentService', () => {
  let service: CancelAppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CancelAppointmentService, AppointmentRepository],
    }).compile();

    service = module.get<CancelAppointmentService>(CancelAppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
