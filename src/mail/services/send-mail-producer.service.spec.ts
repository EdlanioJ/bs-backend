import { Test } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { SendMailProducerService } from './send-mail-producer.service';
import { Queue } from 'bull';

describe('SendMailProducerService', () => {
  let service: SendMailProducerService;
  let queue: Queue;

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
    queue = module.get<Queue>(getQueueToken('send-mail-queue'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call queue with correct values', async () => {
    const data = {
      to: 'any_email',
      type: 'any_type',
      content: [
        {
          key: 'any_key',
          value: 'any_value',
        },
      ],
    };
    const spy = jest.spyOn(queue, 'add');
    await service.execute(data);

    expect(spy).toHaveBeenCalledWith('send-mail-job', data, undefined);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
