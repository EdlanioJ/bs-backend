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
    await this.sendMailService.execute(data);
  }
}
