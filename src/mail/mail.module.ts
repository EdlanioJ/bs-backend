import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SendMailProcessor } from './processor/send-mail.processor';
import { SendMailProducerService } from './services/send-mail-producer.service';
import { SendMailProcessorService } from './services/send-mail-processor.service';

import { BullModule } from '@nestjs/bull';
import { TemplateRepository } from '../template/template.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
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
    TemplateRepository,
  ],
  exports: [SendMailProducerService],
})
export class MailModule {}
