import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import { CreateTemplateDto } from './dto/create-template.dto';
import { FindAllTemplateDto } from './dto/find-all-template.dto';
import { TemplateRepository } from './template.repository';

@Injectable()
export class TemplateService {
  constructor(
    private readonly templateRepo: TemplateRepository,
    private readonly userRepo: UserRepository,
  ) {}
  async create(data: CreateTemplateDto) {
    const user = await this.userRepo.findOne(data.userId);
    if (!user) throw new BadRequestException('User not found');

    if (user.role !== 'ADMIN')
      throw new BadRequestException('User is not admin');

    await this.templateRepo.create({
      body: data.body,
      subject: data.subject,
      type: data.type,
      user: { connect: { id: user.id } },
    });
  }

  async findOne(id: string) {
    return this.templateRepo.findOne(id);
  }

  async findAll(filter: FindAllTemplateDto) {
    return this.templateRepo.findAll({
      take: filter.limit,
      skip: (filter.page - 1) * filter.limit,
    });
  }

  async delete(id: string) {
    await this.templateRepo.delete(id);
  }
}
