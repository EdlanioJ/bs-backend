import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentRepository } from '../repositories';
import { ListAppointmentByCustomerService } from './list-appointment-by-customer.service';

jest.mock('../repositories');

describe(' ListAppointmentByCustomerService', () => {
  let service: ListAppointmentByCustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListAppointmentByCustomerService, AppointmentRepository],
    }).compile();

    service = module.get<ListAppointmentByCustomerService>(
      ListAppointmentByCustomerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
