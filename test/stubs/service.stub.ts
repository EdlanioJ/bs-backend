import faker from '@faker-js/faker';
import { Service } from '@prisma/client';

export const serviceStub = (): Service => ({
  appointmentDurationInMinutes: faker.datatype.number({ min: 1, max: 60 }),
  id: 'any_id',
  name: faker.name.jobArea(),
  createdAt: faker.date.past(),
  providerId: 'any_provider_id',
});
