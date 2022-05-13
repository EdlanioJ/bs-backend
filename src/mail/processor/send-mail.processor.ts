import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

import { SendMailDto } from '../dto';
import { SendMailProcessorService } from '../services';

@Processor('send-mail-queue')
export class SendMailProcessor {
  constructor(private readonly sendMailService: SendMailProcessorService) {}

  @Process('send-mail-job')
  async sendMail(job: Job<SendMailDto>) {
    const { data } = job;
    const input = new SendMailDto();
    input.to = data.to;
    input.type = data.type;
    input.content = data.content;

    await this.sendMailService.execute(input);
  }
}
