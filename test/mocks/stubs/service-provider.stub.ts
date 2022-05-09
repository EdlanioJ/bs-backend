import { ServiceProvider } from '@prisma/client';

export const serviceProviderStub = (): ServiceProvider => ({
  id: 'any_id',
  userId: 'any_user_id',
  name: 'any_name',
  createdAt: new Date(),
});
