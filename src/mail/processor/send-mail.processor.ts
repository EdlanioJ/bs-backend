import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { SendMailDto } from '../dto/send-mail.dto';
import { SendMailProcessorService } from '../services/send-mail-processor.service';

@Processor('send-mail-queue')
export class SendMailProcessor {
  constructor(private readonly sendMailService: SendMailProcessorService) {}

  @Process('send-mail-job')
  async sendMail(job: Job<SendMailDto>) {
    const { data } = job;
    await this.sendMailService.execute(data);
  }
}
