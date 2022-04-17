import { Injectable, BadRequestException } from '@nestjs/common';
import { ServiceProviderRepository } from 'src/service-provider/service-provider.repository';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceRepository } from './service.repository';

@Injectable()
export class ServiceService {
  constructor(
    private readonly serviceRepo: ServiceRepository,
    private readonly providerRepo: ServiceProviderRepository,
  ) {}
  async create(dto: CreateServiceDto) {
    const provider = await this.providerRepo.findByUserId(dto.userId);
    if (!provider) throw new BadRequestException('Provider not found');

    await this.serviceRepo.create({
      name: dto.name,
      provider: { connect: { id: provider.id } },
      appointmentDuration: dto.duration,
    });
  }

  findAll({ page, limit }: { page: number; limit: number }) {
    return this.serviceRepo.findAll({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  findOne(id: string) {
    return this.serviceRepo.findOne(id);
  }
}
