import { ManagerRequest } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
export class ManagerRequestModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdBy: string; // userId

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  rejectedBy?: string;

  @ApiProperty()
  rejectedReason?: string;

  static map(request: ManagerRequest): ManagerRequestModel {
    return {
      id: request.id,
      createdAt: request.createdAt,
      createdBy: request.userId,
      status: request.status,
      rejectedReason: request.rejectReason,
      rejectedBy: request.rejectById,
    };
  }

  static mapCollection(requests: ManagerRequest[]): ManagerRequestModel[] {
    return requests.map(ManagerRequestModel.map);
  }
}
