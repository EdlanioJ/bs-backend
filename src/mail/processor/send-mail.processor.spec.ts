import { Test } from '@nestjs/testing';
import { SendMailProcessorService } from '../services';
import { SendMailProcessor } from './send-mail.processor';

jest.mock('../services');

describe('SendMailProcessor', () => {
  let processor: SendMailProcessor;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SendMailProcessor, SendMailProcessorService],
    }).compile();

    processor = module.get<SendMailProcessor>(SendMailProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});
