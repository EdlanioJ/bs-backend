import { Injectable, BadRequestException } from '@nestjs/common';
import { SendMailProducerService } from '../../mail/service/send-mail-producer.service';
import { ManagerRequestRepository } from '../repository/manager-request.repository';
import { ManagerRepository } from '../repository/manager.repository';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class AcceptManagerService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly managerRepo: ManagerRepository,
    private readonly managerRequestRepo: ManagerRequestRepository,
    private readonly mailProducer: SendMailProducerService,
  ) {}
  async execute({ userId, id }: { userId: string; id: string }) {
    const user = await this.userRepo.findOne(id);
    if (!user) throw new BadRequestException('User not found');

    if (user.role !== 'USER') throw new BadRequestException('Not a valid user');

    const managerRequest = await this.managerRequestRepo.findAvailable(id);
    if (!managerRequest) throw new BadRequestException('No request found');

    const adminUser = await this.userRepo.findOne(userId);
    if (!adminUser) throw new BadRequestException('User not found');

    if (adminUser.role !== 'ADMIN')
      throw new BadRequestException('User is not an admin');

    await this.userRepo.update(id, { role: 'MANAGER' });

    await this.managerRepo.create({
      user: { connect: { id } },
      authorizedBy: { connect: { id: userId } },
    });

    await this.managerRequestRepo.update(id, {
      status: 'ACCEPTED',
    });

    await this.mailProducer.execute({
      to: user.email,
      type: 'manager-accepted-email',
      content: [
        {
          key: 'name',
          value: user.name,
        },
      ],
    });
  }
}
