import { Test, TestingModule } from '@nestjs/testing';
import { appointmentStub } from '../../../test/mocks/stubs';
import { AppointmentRepository } from '../repositories';
import { ListAppointmentByCustomerService } from './list-appointment-by-customer.service';

jest.mock('../repositories');

describe(' ListAppointmentByCustomerService', () => {
  let service: ListAppointmentByCustomerService;
  let appointmentRepo: AppointmentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListAppointmentByCustomerService, AppointmentRepository],
    }).compile();

    service = module.get<ListAppointmentByCustomerService>(
      ListAppointmentByCustomerService,
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
      customerId: '123',
      fromDate: new Date(),
      toDate: new Date(),
    });
    expect(total).toBe(1);
    expect(data[0]).toEqual(expect.objectContaining({ id: stub.id }));
    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(countSpy).toHaveBeenCalledTimes(1);
  });
});
