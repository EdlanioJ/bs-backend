import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { CreateServiceProviderDto } from './dto/create-provider.dto';
import { ServiceProviderRepository } from './service-provider.repository';

@Injectable()
export class ServiceProviderService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly providerRepo: ServiceProviderRepository,
  ) {}
  async create({ userId, name }: CreateServiceProviderDto) {
    const user = await this.userRepo.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found');
    if (user.role !== 'MANAGER')
      throw new UnauthorizedException('User is not a manager');

    await this.providerRepo.create({ user: { connect: { id: userId } }, name });
  }

  async findOne(id: string) {
    return this.providerRepo.findOne(id);
  }

  async delete({ providerId, userId }: { providerId: string; userId: string }) {
    await this.providerRepo.delete(providerId, userId);
  }
}
