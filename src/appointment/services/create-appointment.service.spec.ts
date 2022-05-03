import faker from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ServiceRepository } from '../../service/repositories';
import { UserRepository } from '../../user/repositories';
import { AppointmentRepository } from '../repositories';
import { CreateAppointmentService } from './create-appointment.service';

jest.mock('../../service/repositories');
jest.mock('../../user/repositories');
jest.mock('../repositories');

describe('CreateAppointmentService', () => {
  let service: CreateAppointmentService;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAppointmentService,
        AppointmentRepository,
        ServiceRepository,
        UserRepository,
      ],
    }).compile();
    service = module.get<CreateAppointmentService>(CreateAppointmentService);
    userRepo = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const input = {
    customerId: 'any_customer_id',
    employeeId: 'any_employee_id',
    serviceId: 'any_service_id',
    startTime: faker.date.future(),
  };

  it('should throw BadRequestException if userRepo.findOne return null', () => {
    jest.spyOn(userRepo, 'findOne').mockImplementation(() => null);
    const output = service.execute(input);
    expect(output).rejects.toThrow(
      new BadRequestException('Employee not found'),
    );
  });
});
