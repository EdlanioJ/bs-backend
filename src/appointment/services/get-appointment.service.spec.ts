import { TestingModule, Test } from '@nestjs/testing';
import { GetAppointmentService } from './get-appointment.service';
import { AppointmentRepository } from '../repositories';
import { appointmentStub } from '../../../test/mocks/stubs';

jest.mock('../repositories');

describe('GetAppointmentService', () => {
  let service: GetAppointmentService;
  let appointmentRepo: AppointmentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetAppointmentService, AppointmentRepository],
    }).compile();

    service = module.get<GetAppointmentService>(GetAppointmentService);
    appointmentRepo = module.get<AppointmentRepository>(AppointmentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an appointment', async () => {
    const input = { id: 'any_id' };
    const response = appointmentStub();
    const spy = jest
      .spyOn(appointmentRepo, 'findOne')
      .mockResolvedValue(response);

    const output = await service.execute(input);
    expect(spy).toHaveBeenCalledWith(input.id);
    expect(output).toEqual(expect.objectContaining({ id: response.id }));
  });
});
