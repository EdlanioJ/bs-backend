import faker from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ServiceRepository } from '../../service/repositories';
import { UserRepository } from '../../user/repositories';
import { AppointmentRepository } from '../repositories';
import { CreateAppointmentService } from './create-appointment.service';
import {
  appointmentStub,
  serviceStub,
  userStub,
} from '../../../test/mocks/stubs';

jest.mock('../../service/repositories');
jest.mock('../../user/repositories');
jest.mock('../repositories');

describe('CreateAppointmentService', () => {
  let service: CreateAppointmentService;
  let userRepo: UserRepository;
  let serviceRepo: ServiceRepository;
  let appointmentRepo: AppointmentRepository;

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
    serviceRepo = module.get<ServiceRepository>(ServiceRepository);
    appointmentRepo = module.get<AppointmentRepository>(AppointmentRepository);
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
    const spy = jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
    const output = service.execute(input);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(input.employeeId);
    expect(output).rejects.toThrow(
      new BadRequestException('Employee not found'),
    );
  });

  it('should throw BadRequestException if user returned is no an employee', () => {
    jest
      .spyOn(userRepo, 'findOne')
      .mockResolvedValue({ ...userStub(), role: 'ADMIN' });
    const output = service.execute(input);
    expect(output).rejects.toThrow(
      new BadRequestException('User is not an employee'),
    );
  });

  it('should throw UnauthorizedException if employee is customer', () => {
    jest.spyOn(userRepo, 'findOne').mockResolvedValue({
      ...userStub(),
      role: 'EMPLOYEE',
      id: input.customerId,
    });
    const output = service.execute(input);
    expect(output).rejects.toThrow(
      new UnauthorizedException('Employee cannot be customer'),
    );
  });

  it('should throw BadRequestException if startTime is before now', () => {
    jest.spyOn(userRepo, 'findOne').mockResolvedValue({
      ...userStub(),
      role: 'EMPLOYEE',
    });
    const startTime = faker.date.past();
    const output = service.execute({
      ...input,
      startTime,
    });
    expect(output).rejects.toThrow(
      new BadRequestException('Appointment cannot be in the past'),
    );
  });

  it('should throw BadRequestException if serviceRepo.findOne return null', () => {
    jest.spyOn(userRepo, 'findOne').mockResolvedValue({
      ...userStub(),
      role: 'EMPLOYEE',
    });
    jest.spyOn(serviceRepo, 'findOne').mockResolvedValue(null);
    const output = service.execute(input);
    expect(output).rejects.toThrow(
      new BadRequestException('Service not found'),
    );
  });

  it('should throw BadRequestException if appointmentRepo.findAvailable return appointment', () => {
    jest.spyOn(userRepo, 'findOne').mockResolvedValue({
      ...userStub(),
      role: 'EMPLOYEE',
    });
    jest.spyOn(serviceRepo, 'findOne').mockResolvedValue(serviceStub());
    jest
      .spyOn(appointmentRepo, 'findAvailable')
      .mockResolvedValue(appointmentStub());
    const output = service.execute(input);
    expect(output).rejects.toThrow(
      new BadRequestException('Appointment is not available'),
    );
  });

  it('should create an appointment successfully', async () => {
    jest.spyOn(userRepo, 'findOne').mockResolvedValue({
      ...userStub(),
      role: 'EMPLOYEE',
    });
    jest.spyOn(serviceRepo, 'findOne').mockResolvedValue(serviceStub());
    jest.spyOn(appointmentRepo, 'findAvailable').mockResolvedValue(null);
    const spy = jest.spyOn(appointmentRepo, 'create');
    await service.execute(input);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
