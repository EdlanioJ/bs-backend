import { Test, TestingModule } from '@nestjs/testing';
import {
  CancelAppointmentService,
  CompleteAppointmentService,
  CreateAppointmentService,
  GetAppointmentService,
  ListAppointmentByCustomerService,
  ListAppointmentByEmployeeService,
  ListAppointmentService,
} from '../services';
import { AppointmentController } from './appointment.controller';

jest.mock('../services');

describe('AppointmentController', () => {
  let controller: AppointmentController;
  let createAppointment: CreateAppointmentService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentController],
      providers: [
        CancelAppointmentService,
        CompleteAppointmentService,
        CreateAppointmentService,
        GetAppointmentService,
        ListAppointmentByCustomerService,
        ListAppointmentByEmployeeService,
        ListAppointmentService,
      ],
    }).compile();

    controller = module.get<AppointmentController>(AppointmentController);
    createAppointment = module.get<CreateAppointmentService>(
      CreateAppointmentService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create appointment', async () => {
    const spy = jest.spyOn(createAppointment, 'execute');
    const employeeId = 'employee_id';
    const customerId = 'customer_id';
    const serviceId = 'service_id';
    const start = new Date();
    await controller.create(
      {
        employeeId,
        serviceId,
        startAt: start,
      },
      customerId,
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      employeeId,
      serviceId,
      customerId,
      startTime: start,
    });
  });
});
