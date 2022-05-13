import { ProviderConnection } from '@prisma/client';

export const providerConnectionStub = (): ProviderConnection => ({
  id: 'any_id',
  providerId: 'any_provider_id',
  userId: 'any_user_id',
  createdAt: new Date(),
});
