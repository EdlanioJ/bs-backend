import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { JobOptions, Queue } from 'bull';

import { SendMailDto } from '../dto';

@Injectable()
export class SendMailProducerService {
  constructor(@InjectQueue('send-mail-queue') private readonly queue: Queue) {}

  async execute(data: SendMailDto, opts?: JobOptions): Promise<void> {
    await this.queue.add('send-mail-job', data, opts);
  }
}
