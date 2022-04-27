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

  static map(data: ServiceProvider): ServiceProviderModel {
    return {
      ...data,
      createdBy: data.userId,
    };
  }

  static mapCollection(data: ServiceProvider[]): ServiceProviderModel[] {
    return data.map(this.map);
  }
}
