import { ApiProperty } from '@nestjs/swagger';
import { Service } from '@prisma/client';

export class ServiceModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  appointmentDurationInMinutes: number;

  static map(service: Service): ServiceModel {
    return {
      appointmentDurationInMinutes: service.appointmentDurationInMinutes,
      createdAt: service.createdAt,
      id: service.id,
      name: service.name,
      provider: service.providerId,
    };
  }

  static mapCollection(services: Service[]): ServiceModel[] {
    return services.map(ServiceModel.map);
  }
}
