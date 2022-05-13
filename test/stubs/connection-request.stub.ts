import { ProviderConnectionRequest } from '@prisma/client';

export const connectionRequestStub = (): ProviderConnectionRequest => ({
  id: 'any_id',
  providerId: 'any_provider_id',
  employeeId: 'any_employee_id',
  status: 'PENDING',
  createdAt: new Date(),
});
