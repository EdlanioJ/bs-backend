import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentRepository } from '../repositories';
import { ListAppointmentService } from './list-appointment.service';

jest.mock('../repositories');
describe('ListAppointmentService', () => {
  let service: ListAppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListAppointmentService, AppointmentRepository],
    }).compile();

    service = module.get<ListAppointmentService>(ListAppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
