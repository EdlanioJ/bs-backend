import { Test, TestingModule } from '@nestjs/testing';
import { appointmentStub } from '../../../test/stubs';
import { AppointmentRepository } from '../repositories';
import { ListAppointmentService } from './list-appointment.service';

jest.mock('../repositories');
describe('ListAppointmentService', () => {
  let service: ListAppointmentService;
  let appointmentRepo: AppointmentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListAppointmentService, AppointmentRepository],
    }).compile();

    service = module.get<ListAppointmentService>(ListAppointmentService);
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
    const { data, total } = await service.execute({
      page: 1,
      limit: 1,
    });
    expect(total).toBe(1);
    expect(data[0]).toEqual(expect.objectContaining({ id: stub.id }));
    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(countSpy).toHaveBeenCalledTimes(1);
  });
});
