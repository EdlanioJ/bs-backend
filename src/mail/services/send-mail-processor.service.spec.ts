import { MailerService } from '@nestjs-modules/mailer';
import { Test } from '@nestjs/testing';
import { TemplateRepository } from '../../template/repositories';
import { SendMailProcessorService } from './send-mail-processor.service';
import { templateStub } from '../../../test/stubs';

jest.mock('../../template/repositories');
jest.mock('@nestjs-modules/mailer');

describe('SendMailProcessorService', () => {
  let service: SendMailProcessorService;
  let templateRepo: TemplateRepository;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SendMailProcessorService, MailerService, TemplateRepository],
    }).compile();

    service = module.get<SendMailProcessorService>(SendMailProcessorService);
    templateRepo = module.get<TemplateRepository>(TemplateRepository);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send mail', async () => {
    const content = [{ key: 'key', value: 'value' }];
    const to = 'any_email';
    const type = 'any_type';
    const template = templateStub();
    const findOneByTypeSpy = jest
      .spyOn(templateRepo, 'findOneByType')
      .mockResolvedValueOnce(template);
    const sendMailSpy = jest.spyOn(mailerService, 'sendMail');
    await service.execute({ content, to, type });
    expect(findOneByTypeSpy).toHaveBeenCalledWith(type);
    expect(sendMailSpy).toHaveBeenCalledWith({
      to,
      html: expect.any(String),
      subject: template.subject,
    });
  });
});
