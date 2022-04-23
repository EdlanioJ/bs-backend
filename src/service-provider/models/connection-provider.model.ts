import { ProviderEmployeeConnection } from '@prisma/client';

export class ProviderConnectionModel {
  id: string;
  providerId: string;
  createdAt: Date;
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
