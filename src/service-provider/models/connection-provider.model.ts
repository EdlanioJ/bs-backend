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

  static map(
    providerConnection: ProviderEmployeeConnection,
  ): ProviderConnectionModel {
    return {
      id: providerConnection.id,
      providerId: providerConnection.providerId,
      createdAt: providerConnection.createdAt,
      userId: providerConnection.userId,
    };
  }

  static mapCollection(
    providerConnections: ProviderEmployeeConnection[],
  ): ProviderConnectionModel[] {
    return providerConnections.map(ProviderConnectionModel.map);
  }
}
