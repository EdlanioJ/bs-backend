import { Injectable, BadRequestException } from '@nestjs/common';

import {
  ManagerRepository,
  ManagerRequestRepository,
  UserRepository,
} from '../repositories';

import { SendMailProducerService } from '../../mail/services';

type Input = {
  userId: string;
  requestId: string;
};

@Injectable()
export class AcceptManagerService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly managerRepo: ManagerRepository,
    private readonly managerRequestRepo: ManagerRequestRepository,
    private readonly mailProducer: SendMailProducerService,
  ) {}
  async execute({ userId, requestId }: Input): Promise<void> {
    const managerRequest = await this.managerRequestRepo.findOne(requestId);
    if (!managerRequest) throw new BadRequestException('No request found');
    if (managerRequest.status !== 'PENDING')
      throw new BadRequestException('Request not available');

    const user = await this.userRepo.findOne(managerRequest.userId);
    if (!user) throw new BadRequestException('Manager request user not found');

    if (user.role !== 'USER')
      throw new BadRequestException('Invalid manager request user');

    const admin = await this.userRepo.findOne(userId);
    if (!admin) throw new BadRequestException('User not found');

    if (admin.role !== 'ADMIN')
      throw new BadRequestException('Not a valid user');

    await this.managerRepo.create({
      user: { connect: { id: user.id } },
      authorizedBy: { connect: { id: admin.id } },
    });

    await this.userRepo.update(user.id, { role: 'MANAGER' });

    await this.managerRequestRepo.update(managerRequest.id, {
      status: 'ACCEPTED',
    });

    await this.mailProducer.execute({
      to: user.email,
      type: 'manager-request-accepted',
      content: [
        {
          key: 'name',
          value: user.name,
        },
      ],
    });
  }
}
