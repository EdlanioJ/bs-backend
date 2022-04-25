import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { TemplateRepository } from '../../template/repositories';
import { SendMailDto } from '../dto';

@Injectable()
export class SendMailProcessorService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly templateRepo: TemplateRepository,
  ) {}
  async execute({ content, to, type }: SendMailDto): Promise<void> {
    const template = await this.templateRepo.findOneByType(type);

    let html = template.body;
    content.forEach(({ key, value }) => {
      html = html.replace(`{{${key}}}`, value);
    });

    await this.mailerService.sendMail({
      to,
      html,
      subject: template.subject,
    });
  }
}
