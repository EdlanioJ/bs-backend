import { Test, TestingModule } from '@nestjs/testing';
import { appointmentStub } from '../../../test/mocks/stubs';
import { AppointmentModel } from '../models';
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
  let getAppointment: GetAppointmentService;

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
    getAppointment = module.get<GetAppointmentService>(GetAppointmentService);
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

  it('should get an appointment', async () => {
    const stub = appointmentStub();
    const result: AppointmentModel = {
      id: stub.id,
      appointmentWith: stub.employeeId,
      service: stub.serviceId,
      createdAt: stub.createdAt,
      endAt: stub.end,
      startAt: stub.start,
      status: stub.status,
      userId: stub.customerId,
    };
    const spy = jest
      .spyOn(getAppointment, 'execute')
      .mockResolvedValueOnce(result);
    const output = await controller.get(stub.id);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ id: stub.id });
    expect(output).toBe(result);
  });
});
