import { BadRequestException, Injectable } from '@nestjs/common';
import { SendMailProducerService } from '../../mail/services/send-mail-producer.service';
import { ManagerRequestRepository } from '../repository/manager-request.repository';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class RejectManagerService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly managerRequestRepo: ManagerRequestRepository,
    private readonly mailProducer: SendMailProducerService,
  ) {}

  async execute({
    id,
    userId,
    reason,
  }: {
    id: string;
    userId: string;
    reason: string;
  }) {
    const user = await this.userRepo.findOne(id);
    if (!user) throw new BadRequestException('User not found');

    const managerRequest = await this.managerRequestRepo.findAvailable(id);
    if (!managerRequest) throw new BadRequestException('No request found');

    const adminUser = await this.userRepo.findOne(userId);
    if (!adminUser) throw new BadRequestException('User not found');

    if (adminUser.role !== 'ADMIN')
      throw new BadRequestException('User is not an admin');

    await this.managerRequestRepo.update(id, {
      status: 'REJECTED',
      rejectBy: { connect: { id: userId } },
      rejectReason: reason,
    });

    await this.mailProducer.execute({
      to: user.email,
      type: 'manager-rejected-email',
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
