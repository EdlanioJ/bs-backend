import { Test } from '@nestjs/testing';
import { SendMailProcessorService } from '../services';
import { SendMailProcessor } from './index';

jest.mock('../services');

describe('SendMailProcessor', () => {
  let processor: SendMailProcessor;
  let sendMailService: SendMailProcessorService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SendMailProcessor, SendMailProcessorService],
    }).compile();

    processor = module.get<SendMailProcessor>(SendMailProcessor);
    sendMailService = module.get<SendMailProcessorService>(
      SendMailProcessorService,
    );
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  it('should call send mail service with correct data', async () => {
    const job: any = {
      data: {
        to: 'to_any',
        type: 'any_type',
        content: [{ key: 'key_any', value: 'value_any' }],
      },
    };
    const spy = jest.spyOn(sendMailService, 'execute');
    await processor.sendMail(job);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(job.data);
  });
});
