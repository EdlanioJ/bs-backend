import { Test, TestingModule } from '@nestjs/testing';

import { appointmentStub } from '../../../test/stubs';
import { PaginateAppointmentQuery, SearchAppointmentQuery } from '../dto';
import { AppointmentModel, SimpleAppointmentModel } from '../models';
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

      const pagination = new PaginateAppointmentQuery();
      const output = await controller.list(pagination);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        page,
        limit,
        orderBy: 'createdAt',
        sort: 'desc',
      });
      expect(output.total).toBe(listResult.total);
      expect(output.page).toBe(page);
      expect(output.limit).toBe(limit);
      expect(output.rows[0]).toEqual(
        expect.objectContaining(listResult.data[0]),
      );
    });
  });

  describe('ListAppointmentByCustomer', () => {
    it('should return appointments and total', async () => {
      const customerId = 'an_user_id';

      const spy = jest
        .spyOn(listAppointmentByCustomer, 'execute')
        .mockResolvedValueOnce(listResult);

      const pagination = new PaginateAppointmentQuery();
      const searchParam = new SearchAppointmentQuery();
      const output = await controller.listProfileUser(
        customerId,
        pagination,
        searchParam,
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        customerId,
        fromDate: expect.any(Date),
        toDate: expect.any(Date),
        page,
        limit,
        orderBy: 'createdAt',
        sort: 'desc',
        status: ['PENDING', 'CONFIRMED', 'COMPLETED'],
      });
      expect(output.total).toBe(listResult.total);
      expect(output.page).toBe(page);
      expect(output.limit).toBe(limit);

      expect(output.rows[0]).toEqual(
        expect.objectContaining(listResult.data[0]),
      );
    });
  });

  describe('ListAppointmentByEmployee', () => {
    it('should return appointments and total', async () => {
      const employeeId = 'an_user_id';
      const spy = jest
        .spyOn(listAppointmentByEmployee, 'execute')
        .mockResolvedValueOnce(listResult);

      const pagination = new PaginateAppointmentQuery();
      const searchParam = new SearchAppointmentQuery();
      const output = await controller.listByEmployee(
        employeeId,
        pagination,
        searchParam,
      );
      expect(spy).toHaveBeenCalledWith({
        employeeId,
        fromDate: expect.any(Date),
        toDate: expect.any(Date),
        page,
        limit,
        orderBy: 'createdAt',
        sort: 'desc',
        status: ['PENDING', 'CONFIRMED'],
      });
      expect(output.total).toBe(listResult.total);
      expect(output.page).toBe(page);
      expect(output.limit).toBe(limit);
      expect(output.rows[0]).toEqual(
        expect.objectContaining(SimpleAppointmentModel.map(listResult.data[0])),
      );
    });
  });

  describe('ListPRofileEmployee', () => {
    it('should return appointments and total', async () => {
      const employeeId = 'an_user_id';
      const spy = jest
        .spyOn(listAppointmentByEmployee, 'execute')
        .mockResolvedValueOnce(listResult);

      const pagination = new PaginateAppointmentQuery();
      const searchParam = new SearchAppointmentQuery();
      const output = await controller.listProfileEmployee(
        employeeId,
        pagination,
        searchParam,
      );
      expect(spy).toHaveBeenCalledWith({
        employeeId,
        fromDate: expect.any(Date),
        toDate: expect.any(Date),
        page,
        limit,
        orderBy: 'createdAt',
        sort: 'desc',
        status: ['PENDING', 'CONFIRMED', 'COMPLETED'],
      });
      expect(output.total).toBe(listResult.total);
      expect(output.page).toBe(page);
      expect(output.limit).toBe(limit);
      expect(output.rows[0]).toEqual(
        expect.objectContaining(listResult.data[0]),
      );
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
