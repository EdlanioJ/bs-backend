import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../../user/repositories';
import { RequestConnectionRepository } from '../repositories';

type Input = {
  userId: string;
  requestId: string;
};
@Injectable()
export class RejectConnectionService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly requestConnectionRepo: RequestConnectionRepository,
  ) {}

  async execute({ userId, requestId }: Input): Promise<void> {
    const user = await this.userRepo.findOne(userId);
    if (!user) throw new BadRequestException('User not found');
    if (user.role !== 'USER') throw new BadRequestException('Not a valid user');

    const requestConnection = await this.requestConnectionRepo.findOne(
      requestId,
    );
    if (!requestConnection)
      throw new BadRequestException('Connection not found');

    if (requestConnection.status !== 'PENDING')
      throw new BadRequestException('Connection already accepted');

    if (requestConnection.employeeId !== userId)
      throw new BadRequestException('You are not the employee');

    await this.requestConnectionRepo.update(requestId, {
      status: 'REJECTED',
    });
  }
}
