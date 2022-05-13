import { Test, TestingModule } from '@nestjs/testing';
import { createResponse } from 'node-mocks-http';

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
import { AppointmentController } from './index';

jest.mock('../services');

describe('AppointmentController', () => {
  let controller: AppointmentController;
  let createAppointment: CreateAppointmentService;
  let getAppointment: GetAppointmentService;
  let listAppointment: ListAppointmentService;
  let listAppointmentByCustomer: ListAppointmentByCustomerService;
  let listAppointmentByEmployee: ListAppointmentByEmployeeService;
  let cancelAppointment: CancelAppointmentService;
  let completeAppointment: CompleteAppointmentService;

  const stub = appointmentStub();
  const page = 1;
  const limit = 10;
  const listResult = {
    data: [
      {
        id: stub.id,
        appointmentWith: stub.employeeId,
        service: stub.serviceId,
        createdAt: stub.createdAt,
        endAt: stub.end,
        startAt: stub.start,
        status: stub.status,
        userId: stub.customerId,
      },
    ],
    total: 1,
  };

  const expectedListObject = {
    id: stub.id,
    appointmentWith: stub.employeeId,
    service: stub.serviceId,
    createdAt: stub.createdAt.toISOString(),
    endAt: stub.end.toISOString(),
    startAt: stub.start.toISOString(),
    status: stub.status,
  };

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
    listAppointment = module.get<ListAppointmentService>(
      ListAppointmentService,
    );
    listAppointmentByCustomer = module.get<ListAppointmentByCustomerService>(
      ListAppointmentByCustomerService,
    );
    listAppointmentByEmployee = module.get<ListAppointmentByEmployeeService>(
      ListAppointmentByEmployeeService,
    );
    cancelAppointment = module.get<CancelAppointmentService>(
      CancelAppointmentService,
    );
    completeAppointment = module.get<CompleteAppointmentService>(
      CompleteAppointmentService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('CreateAppointment', () => {
    it('should call execute with correct values', async () => {
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

  describe('GetAppointment', () => {
    it('should return an appointment', async () => {
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

  describe('ListAppointment', () => {
    it('should return appointments and total', async () => {
      const spy = jest
        .spyOn(listAppointment, 'execute')
        .mockResolvedValueOnce(listResult);
      const res = createResponse();
      await controller.list(res);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ page, limit });
      expect(res.getHeader('x-total-count')).toBe(listResult.total);
      expect(res.getHeader('x-page')).toBe(page);
      expect(res.getHeader('x-limit')).toBe(limit);
      const body = res._getJSONData();
      expect(body[0]).toEqual(expect.objectContaining(expectedListObject));
    });
  });

  describe('ListAppointmentByCustomer', () => {
    it('should return appointments and total', async () => {
      const customerId = 'an_user_id';
      const fromDate = new Date();
      const toDate = new Date();
      const res = createResponse();
      const spy = jest
        .spyOn(listAppointmentByCustomer, 'execute')
        .mockResolvedValueOnce(listResult);

      await controller.listByCustomer(res, customerId, fromDate, toDate);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        customerId,
        fromDate,
        toDate,
        page,
        limit,
      });
      expect(res.getHeader('x-total-count')).toBe(listResult.total);
      expect(res.getHeader('x-page')).toBe(page);
      expect(res.getHeader('x-limit')).toBe(limit);
      const body = res._getJSONData();
      expect(body[0]).toEqual(expect.objectContaining(expectedListObject));
    });
  });

  describe('ListAppointmentByEmployee', () => {
    it('should return appointments and total', async () => {
      const employeeId = 'an_user_id';
      const fromDate = new Date();
      const toDate = new Date();
      const spy = jest
        .spyOn(listAppointmentByEmployee, 'execute')
        .mockResolvedValueOnce(listResult);

      const res = createResponse();
      await controller.listByEmployee(res, employeeId, fromDate, toDate);
      expect(spy).toHaveBeenCalledWith({
        employeeId,
        fromDate,
        toDate,
        page,
        limit,
      });
      expect(res.getHeader('x-total-count')).toBe(listResult.total);
      expect(res.getHeader('x-page')).toBe(page);
      expect(res.getHeader('x-limit')).toBe(limit);
      const body = res._getJSONData();
      expect(body[0]).toEqual(expect.objectContaining(expectedListObject));
    });
  });

  describe('CancelAppointment', () => {
    it('should call execute with correct values', async () => {
      const userId = 'an_user_id';
      const spy = jest.spyOn(cancelAppointment, 'execute');
      await controller.cancel(
        {
          cancelReason: 'reason',
        },
        stub.id,
        userId,
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        appointmentId: stub.id,
        reason: 'reason',
        userId,
      });
    });
  });

  describe('CompleteAppointment', () => {
    it('should call execute with correct values', async () => {
      const userId = 'an_user_id';
      const appointmentId = stub.id;
      const spy = jest.spyOn(completeAppointment, 'execute');
      await controller.complete(appointmentId, userId);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        appointmentId,
        userId,
      });
    });
  });
});
