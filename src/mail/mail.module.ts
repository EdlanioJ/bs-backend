import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SendMailProcessor } from './processor/send-mail.processor';
import { SendMailProducerService } from './service/send-mail-producer.service';
import { SendMailProcessorService } from './service/send-mail-processor.service';

import { TemplateModule } from '../template/template.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TemplateModule,
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
        defaults: {
          sender: {
            name: configService.get('MAIL_SENDER_NAME'),
            address: configService.get('MAIL_SENDER_ADDRESS'),
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
  ],
  exports: [SendMailProducerService],
})
export class MailModule {}
