import { BadRequestException, Injectable } from '@nestjs/common';
import { ServiceProviderRepository } from '../../service-provider/repositories';
import { ServiceRepository } from '../repositories';

type Input = {
  userId: string;
  name: string;
  appointmentDurationInMinutes: number;
};
@Injectable()
export class CreateProviderServiceService {
  constructor(
    private readonly serviceRepo: ServiceRepository,
    private readonly providerRepo: ServiceProviderRepository,
  ) {}

  async execute({
    appointmentDurationInMinutes,
    name,
    userId,
  }: Input): Promise<void> {
    const provider = await this.providerRepo.findByUserId(userId);
    if (!provider) throw new BadRequestException('User has no Provider');

    await this.serviceRepo.create({
      name,
      provider: { connect: { id: provider.id } },
      appointmentDurationInMinutes,
    });
  }
}
