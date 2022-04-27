import { ApiProperty } from '@nestjs/swagger';
import { ProviderEmployeeConnection } from '@prisma/client';

export class ProviderConnectionModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  providerId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  userId: string;

  static map(data: ProviderEmployeeConnection): ProviderConnectionModel {
    return {
      ...data,
    };
  }

  static mapCollection(
    data: ProviderEmployeeConnection[],
  ): ProviderConnectionModel[] {
    return data.map(ProviderConnectionModel.map);
  }
}
