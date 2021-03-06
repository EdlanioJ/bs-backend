import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ServiceProviderRepository } from '../repositories';

type Input = {
  id: string;
  userId: string;
};

@Injectable()
export class DeleteServiceProviderService {
  constructor(private readonly providerRepo: ServiceProviderRepository) {}
  async execute({ id, userId }: Input): Promise<void> {
    const provider = await this.providerRepo.findOne(id);

    if (!provider) throw new BadRequestException('Service Provider not found');
    if (provider.userId !== userId)
      throw new UnauthorizedException('Invalid user');

    await this.providerRepo.delete(id);
  }
}
