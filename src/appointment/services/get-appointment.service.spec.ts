import { TestingModule, Test } from '@nestjs/testing';
import { GetAppointmentService } from './get-appointment.service';
import { AppointmentRepository } from '../repositories';

jest.mock('../repositories');

describe('GetAppointmentService', () => {
  let service: GetAppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetAppointmentService, AppointmentRepository],
    }).compile();

    service = module.get<GetAppointmentService>(GetAppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
