import { ApiProperty } from '@nestjs/swagger';
import { ProviderConnection } from '@prisma/client';

export class ProviderConnectionModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  providerId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  userId: string;

  static map(providerConnection: ProviderConnection): ProviderConnectionModel {
    return {
      id: providerConnection.id,
      providerId: providerConnection.providerId,
      createdAt: providerConnection.createdAt,
      userId: providerConnection.userId,
    };
  }

  static mapCollection(
    providerConnections: ProviderConnection[],
  ): ProviderConnectionModel[] {
    return providerConnections.map(ProviderConnectionModel.map);
  }
}
