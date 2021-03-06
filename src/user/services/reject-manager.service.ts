import { BadRequestException, Injectable } from '@nestjs/common';

import { ManagerRequestRepository, UserRepository } from '../repositories';
import { SendMailProducerService } from '../../mail/services';

type Input = {
  requestId: string;
  userId: string;
  reason: string;
};

@Injectable()
export class RejectManagerService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly managerRequestRepo: ManagerRequestRepository,
    private readonly mailProducer: SendMailProducerService,
  ) {}

  async execute({ requestId, userId, reason }: Input): Promise<void> {
    const managerRequest = await this.managerRequestRepo.findOne(requestId);
    if (!managerRequest) throw new BadRequestException('No request found');
    if (managerRequest.status !== 'PENDING')
      throw new BadRequestException('Request not available');

    const user = await this.userRepo.findOne(managerRequest.userId);
    if (!user) throw new BadRequestException('Manager request user not found');

    const admin = await this.userRepo.findOne(userId);
    if (!admin) throw new BadRequestException('User not found');

    if (admin.role !== 'ADMIN')
      throw new BadRequestException('Not a valid user');

    await this.managerRequestRepo.update(managerRequest.id, {
      status: 'REJECTED',
      rejectBy: { connect: { id: admin.id } },
      rejectReason: reason,
    });

    await this.mailProducer.execute({
      to: user.email,
      type: 'manager-request-rejected',
      content: [
        {
          key: 'name',
          value: user.name,
        },
        {
          key: 'reason',
          value: reason,
        },
      ],
    });
  }
}
