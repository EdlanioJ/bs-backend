import { Service } from '@prisma/client';

export class ServiceModel {
  id: string;
  name: string;
  provider: string;
  createdAt: Date;
  appointmentDurationInMinutes: number;

  static map(data: Service): ServiceModel {
    return {
      ...data,
      provider: data.providerId,
    };
  }

  static mapCollection(data: Service[]): ServiceModel[] {
    return data.map(ServiceModel.map);
  }
}
