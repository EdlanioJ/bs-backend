import { ApiProperty } from '@nestjs/swagger';
import { ServiceProvider } from '@prisma/client';

export class ServiceProviderModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  static map(serviceProvider: ServiceProvider): ServiceProviderModel {
    return {
      id: serviceProvider.id,
      createdAt: serviceProvider.createdAt,
      name: serviceProvider.name,
      createdBy: serviceProvider.userId,
    };
  }

  static mapCollection(
    serviceProviders: ServiceProvider[],
  ): ServiceProviderModel[] {
    return serviceProviders.map(ServiceProviderModel.map);
  }
}
