import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRepository } from '../../user/repositories';
import { TemplateRepository } from '../repositories/template.repository';

type Input = {
  body: string;
  subject: string;
  type: string;
  userId: string;
};

@Injectable()
export class CreateTemplateService {
  constructor(
    private readonly templateRepo: TemplateRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute({ body, subject, type, userId }: Input): Promise<void> {
    const user = await this.userRepo.findOne(userId);
    if (!user) throw new BadRequestException('User not found');

    if (user.role !== 'ADMIN')
      throw new UnauthorizedException('User is not admin');

    await this.templateRepo.create({
      body: body,
      subject: subject,
      type: type,
      user: { connect: { id: user.id } },
    });
  }
}
