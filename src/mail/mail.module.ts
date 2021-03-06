import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

import { SendMailProcessor } from './processor';
import { SendMailProducerService, SendMailProcessorService } from './services';

import { TemplateRepository } from '../template/repositories';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send-mail-queue',
    }),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASS'),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    SendMailProcessorService,
    SendMailProducerService,
    SendMailProcessor,
    TemplateRepository,
  ],
  exports: [SendMailProducerService],
})
export class MailModule {}
