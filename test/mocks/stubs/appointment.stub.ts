import { Appointment } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { addDays, addMinutes } from 'date-fns';

const createdAt = faker.date.past();
const start = addDays(createdAt, 1);
const end = addMinutes(start, 30);

export const appointmentStub = (): Appointment => ({
  id: 'any_appointment_id',
  customerId: 'any_customer_id',
  employeeId: 'any_employee_id',
  serviceId: 'any_service_id',
  status: 'PENDING',
  createdAt: new Date(),
  canceled: null,
  canceledReason: null,
  end,
  start,
});
