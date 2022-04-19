import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ServiceProviderModule } from './service-provider/service-provider.module';
import { ServiceModule } from './service/service.module';
import { MailModule } from './mail/mail.module';
import { TemplateModule } from './template/template.module';

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
