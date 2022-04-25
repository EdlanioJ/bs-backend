import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AppointmentModule } from './appointment';
import { UserModule } from './user';
import { ServiceProviderModule } from './service-provider';
import { ServiceModule } from './service';
import { AuthModule } from './auth';
import { PrismaModule } from './prisma';
import { MailModule } from './mail';
import { TemplateModule } from './template';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get('REDIS_PASS'),
          username: configService.get('REDIS_USER'),
        },
      }),
      inject: [ConfigService],
    }),

    AppointmentModule,
    AuthModule,
    PrismaModule,
    UserModule,
    ServiceProviderModule,
    ServiceModule,
    MailModule,
    TemplateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
