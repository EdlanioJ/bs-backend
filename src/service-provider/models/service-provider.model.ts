import { ServiceProvider } from '@prisma/client';

export class ServiceProviderModel {
  id: string;
  name: string;
  createdBy: string;
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
