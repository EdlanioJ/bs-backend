import { Test } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';

import { SendMailProducerService } from './send-mail-producer.service';

describe('SendMailProducerService', () => {
  let service: SendMailProducerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SendMailProducerService,
        {
          provide: getQueueToken('send-mail-queue'),
          useValue: { add: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<SendMailProducerService>(SendMailProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
