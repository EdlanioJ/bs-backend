import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { TemplateRepository } from '../../template/repositories/template.repository';
import { SendMailDto } from '../dto/send-mail.dto';

@Injectable()
export class SendMailProcessorService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly templateRepo: TemplateRepository,
  ) {}
  async execute(dto: SendMailDto) {
    const template = await this.templateRepo.findOneByType(dto.type);

    let html = template.body;
    dto.content.forEach(({ key, value }) => {
      html = html.replace(`{{${key}}}`, value);
    });

    await this.mailerService.sendMail({
      to: dto.to,
      html: html,
      subject: template.subject,
    });
  }
}
