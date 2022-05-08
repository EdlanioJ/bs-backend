import { Template } from '@prisma/client';

export const templateStub = (): Template => ({
  id: 'any_id',
  type: 'any_type',
  subject: 'any_subject',
  body: 'any body with {{key}}',
  createdAt: new Date(),
  userId: 'any_userId',
});
