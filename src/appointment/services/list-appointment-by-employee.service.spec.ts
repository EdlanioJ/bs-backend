import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentRepository } from '../repositories';
import { ListAppointmentByEmployeeService } from './list-appointment-by-employee.service';

jest.mock('../repositories');

describe('ListAppointmentByEmployeeService', () => {
  let service: ListAppointmentByEmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListAppointmentByEmployeeService, AppointmentRepository],
    }).compile();

    service = module.get<ListAppointmentByEmployeeService>(
      ListAppointmentByEmployeeService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
