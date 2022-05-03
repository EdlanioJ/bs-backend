import { Test, TestingModule } from '@nestjs/testing';
import { ServiceRepository } from '../../service/repositories';
import { UserRepository } from '../../user/repositories';
import { AppointmentRepository } from '../repositories';
import { CreateAppointmentService } from './create-appointment.service';

jest.mock('../../service/repositories');
jest.mock('../../user/repositories');
jest.mock('../repositories');

describe('CreateAppointmentService', () => {
  let service: CreateAppointmentService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
