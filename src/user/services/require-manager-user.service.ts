import { Injectable, BadRequestException } from '@nestjs/common';
import { ManagerRequestRepository } from '../repository/manager-request.repository';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class RequireManagerUserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly managerRequestRepo: ManagerRequestRepository,
  ) {}
  async execute({ userId }: { userId: string }) {
    const user = await this.userRepo.findOne(userId);
    if (!user) throw new BadRequestException('User not found');
    if (user.role !== 'USER')
      throw new BadRequestException('Only users can make this request');

    const checkAvailability = this.managerRequestRepo.findAvailable(userId);
    if (checkAvailability)
      throw new BadRequestException('Request already sent');

    await this.managerRequestRepo.create({
      user: { connect: { id: user.id } },
    });

    // notify admin
  }
}
