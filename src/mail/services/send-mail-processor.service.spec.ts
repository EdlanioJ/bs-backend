import { MailerService } from '@nestjs-modules/mailer';
import { Test } from '@nestjs/testing';
import { TemplateRepository } from '../../template/repositories';
import { SendMailProcessorService } from './send-mail-processor.service';

jest.mock('../../template/repositories');
jest.mock('@nestjs-modules/mailer');

describe('SendMailProcessorService', () => {
  let service: SendMailProcessorService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SendMailProcessorService, MailerService, TemplateRepository],
    }).compile();

    service = module.get<SendMailProcessorService>(SendMailProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
