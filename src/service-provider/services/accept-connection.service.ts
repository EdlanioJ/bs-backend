import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from 'src/user/repository/user.repository';
import { ProviderConnectionRepository } from '../repositories/provider-connection.repository';
import { RequestConnectionRepository } from '../repositories/request-connection.repository';

@Injectable()
export class AcceptConnectionService {
  constructor(
    private readonly useRepo: UserRepository,
    private readonly providerConnectionRepo: ProviderConnectionRepository,
    private readonly requestConnectionRepo: RequestConnectionRepository,
  ) {}
  async execute({
    userId,
    connectionId,
  }: {
    userId: string;
    connectionId: string;
  }) {
    const user = await this.useRepo.findOne(userId);
    if (!user) throw new BadRequestException('User not found');

    if (user.role !== 'USER') throw new BadRequestException('Not a valid user');

    const requestConnection = await this.requestConnectionRepo.findOne(
      connectionId,
    );
    if (!requestConnection)
      throw new BadRequestException('Connection not found');

    if (requestConnection.status !== 'PENDING')
      throw new BadRequestException('Connection already accepted');

    if (requestConnection.employeeId !== userId)
      throw new BadRequestException('You are not the employee');

    await this.requestConnectionRepo.update(connectionId, {
      status: 'ACCEPTED',
    });

    await this.useRepo.update(userId, {
      role: 'EMPLOYEE',
    });

    await this.providerConnectionRepo.create({
      user: { connect: { id: userId } },
      provider: { connect: { id: requestConnection.providerId } },
    });
  }
}
