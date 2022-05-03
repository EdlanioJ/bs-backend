import { User } from '@prisma/client';

export const userStub = (): User => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password',
  role: 'USER',
  createdAt: new Date(),
  avatar: 'any_avatar',
  provider: 'any_provider',
  refreshToken: 'any_refresh_token',
  resetPasswordToken: 'any_reset_password_token',
  resetPasswordExpires: new Date(),
  thirdPartyId: 'any_third_party_id',
});
