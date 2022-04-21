import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { JobOptions, Queue } from 'bull';

import { SendMailDto } from '../dto/send-mail.dto';

@Injectable()
export class SendMailProducerService {
  constructor(@InjectQueue('send-mail-queue') private readonly queue: Queue) {}

  async execute(data: SendMailDto, opts?: JobOptions) {
    await this.queue.add('send-mail-job', data, opts);
  }
}
