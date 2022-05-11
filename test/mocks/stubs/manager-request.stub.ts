import { ManagerRequest } from '@prisma/client';

export const managerRequestStub = (): ManagerRequest => ({
  id: 'any_id',
  createdAt: new Date(),
  rejectById: 'any_admin_id',
  rejectReason: 'rejected reason',
  status: 'PENDING',
  userId: 'any_user_id',
});
