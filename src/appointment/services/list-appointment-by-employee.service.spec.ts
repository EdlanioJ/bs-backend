import { Test, TestingModule } from '@nestjs/testing';
import { appointmentStub } from '../../../test/stubs';
import { AppointmentRepository } from '../repositories';
import { ListAppointmentByEmployeeService } from './list-appointment-by-employee.service';

jest.mock('../repositories');

describe('ListAppointmentByEmployeeService', () => {
  let service: ListAppointmentByEmployeeService;
  let appointmentRepo: AppointmentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListAppointmentByEmployeeService, AppointmentRepository],
    }).compile();

    service = module.get<ListAppointmentByEmployeeService>(
      ListAppointmentByEmployeeService,
    );
    appointmentRepo = module.get<AppointmentRepository>(AppointmentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of appointments', async () => {
    const stub = appointmentStub();
    const result = [stub];
    const findAllSpy = jest
      .spyOn(appointmentRepo, 'findAll')
      .mockResolvedValue(result);
    const countSpy = jest.spyOn(appointmentRepo, 'count').mockResolvedValue(1);

    const { total, data } = await service.execute({
      page: 1,
      limit: 1,
      employeeId: 'employee_id',
      fromDate: new Date(),
      toDate: new Date(),
    });

    expect(total).toBe(1);
    expect(data[0]).toEqual(expect.objectContaining({ id: stub.id }));
    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(countSpy).toHaveBeenCalledTimes(1);
  });
});
