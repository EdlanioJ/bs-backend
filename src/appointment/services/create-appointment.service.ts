import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { addMinutes, isBefore, startOfHour } from 'date-fns';
import { ServiceRepository } from '../../service/repositories';
import { UserRepository } from '../../user/repositories';
import { AppointmentRepository } from '../repositories';

type Input = {
  employeeId: string;
  customerId: string;
  serviceId: string;
  startTime: Date;
};

@Injectable()
export class CreateAppointmentService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly appointmentRepo: AppointmentRepository,
    private readonly serviceRepo: ServiceRepository,
  ) {}

  async execute({
    customerId,
    employeeId,
    serviceId,
    startTime,
  }: Input): Promise<void> {
    const employee = await this.userRepo.findOne(employeeId);
    if (!employee) throw new BadRequestException('Employee not found');

    if (employee.role !== 'EMPLOYEE')
      throw new UnauthorizedException('User is not an employee');

    if (employee.id === customerId)
      throw new UnauthorizedException('Employee cannot be customer');

    const hourStart = startOfHour(startTime);
    if (isBefore(hourStart, new Date()))
      throw new BadRequestException('Appointment cannot be in the past');

    const service = await this.serviceRepo.findOne(serviceId);
    if (!service) throw new BadRequestException('Service not found');

    const endTime = addMinutes(startTime, service.appointmentDurationInMinutes);
    const checkAvailability = await this.appointmentRepo.findAvailable(
      employeeId,
      startTime,
      endTime,
    );

    if (checkAvailability)
      throw new BadRequestException('Appointment is not available');

    await this.appointmentRepo.create({
      customer: { connect: { id: customerId } },
      employee: { connect: { id: employeeId } },
      service: { connect: { id: serviceId } },
      start: startTime,
      end: endTime,
    });

    // notify employee
    // notify service provider
  }
}
