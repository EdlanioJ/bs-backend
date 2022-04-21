import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { startOfHour, isBefore, addMinutes } from 'date-fns';
import { AppointmentRepository } from './appointment.repository';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { CompleteAppointmentDto } from './dto/complete-appointment.dto';
import {
  ListAppointmentDto,
  ListAppointmentWithIdDto,
} from './dto/list-appointment.dto';
import { ServiceRepository } from 'src/service/service.repository';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly appointmentRepo: AppointmentRepository,
    private readonly serviceRepo: ServiceRepository,
  ) {}
  async create(dto: CreateAppointmentDto) {
    const employee = await this.userRepo.findOne(dto.employeeId);
    if (!employee) throw new UnauthorizedException('Employee not found');

    if (employee.role !== 'EMPLOYEE')
      throw new UnauthorizedException('User is not an employee');

    if (employee.id === dto.customerId)
      throw new UnauthorizedException('Employee cannot be customer');

    const hourStart = startOfHour(dto.start);
    if (isBefore(hourStart, new Date()))
      throw new BadRequestException('Appointment cannot be in the past');

    const service = await this.serviceRepo.findOne(dto.serviceId);
    if (!service) throw new BadRequestException('Service not found');

    const endTime = addMinutes(dto.start, service.appointmentDuration);
    const checkAvailability = await this.appointmentRepo.findAvailable(
      dto.employeeId,
      dto.start,
      endTime,
    );

    if (checkAvailability)
      throw new BadRequestException('Appointment is not available');

    await this.appointmentRepo.create({
      customer: { connect: { id: dto.customerId } },
      employee: { connect: { id: dto.employeeId } },
      service: { connect: { id: dto.serviceId } },
      start: dto.start,
      end: endTime,
    });

    // notify employee
  }

  async cancel(dto: CancelAppointmentDto) {
    const appointment = await this.appointmentRepo.findOne(dto.appointmentId);
    if (!appointment) throw new UnauthorizedException('Appointment not found');

    if (appointment.customerId !== dto.userId)
      throw new UnauthorizedException('User is not the customer');

    if (appointment.status === 'CANCELLED')
      throw new BadRequestException('Appointment is already cancelled');

    if (appointment.status === 'COMPLETED')
      throw new BadRequestException('Appointment is already completed');

    await this.appointmentRepo.update(dto.appointmentId, {
      canceled: new Date(),
      canceledReason: dto.reason,
    });

    // notify employee
  }

  async complete(dto: CompleteAppointmentDto) {
    const appointment = await this.appointmentRepo.findOne(dto.appointmentId);
    if (!appointment) throw new UnauthorizedException('Appointment not found');

    if (appointment.employeeId !== dto.userId)
      throw new UnauthorizedException('User is not the employee');

    if (appointment.status === 'COMPLETED')
      throw new BadRequestException('Appointment is already completed');

    if (appointment.status === 'CANCELLED')
      throw new BadRequestException('Appointment is cancelled');

    if (isBefore(appointment.start, new Date()))
      throw new BadRequestException('Appointment cannot be in the past');

    await this.appointmentRepo.update(dto.appointmentId, {
      status: 'COMPLETED',
    });

    // notify customer
  }

  async findOne(id: string) {
    return this.appointmentRepo.findOne(id);
  }

  async list(dto: ListAppointmentDto) {
    return this.appointmentRepo.findAll({
      take: dto.limit,
      skip: dto.page * dto.limit,
    });
  }

  async listByEmployee(dto: ListAppointmentWithIdDto) {
    return this.appointmentRepo.findAll({
      take: dto.limit,
      skip: (dto.page - 1) * dto.limit,
      where: {
        employeeId: dto.id,
        start: {
          gte: dto.startFrom,
          lte: dto.startTo,
        },
      },
    });
  }

  async listByCustomer(dto: ListAppointmentWithIdDto) {
    return this.appointmentRepo.findAll({
      take: dto.limit,
      skip: (dto.page - 1) * dto.limit,
      where: {
        customerId: dto.id,
        start: {
          gte: dto.startFrom,
          lte: dto.startTo,
        },
      },
    });
  }
}
