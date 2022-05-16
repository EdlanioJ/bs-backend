import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const processId = process.pid;
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableShutdownHooks();
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Beauty Spaces API')
    .setVersion('0.0.1')
    .setDescription('API Doc for Beauty Spaces')
    .setExternalDoc('GitHub', 'https://github.com/EdlanioJ/bs-backend')
    .addBearerAuth(
      {
        type: 'http',
        name: 'Authorization',
        scheme: 'Bearer',
        bearerFormat: 'Bearer',
        in: 'header',
      },
      'refresh-token',
    )
    .addBearerAuth(
      {
        type: 'http',
        name: 'Authorization',
        scheme: 'Bearer',
        bearerFormat: 'Bearer',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Beauty Spaces API',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port, () => {
    logger.log(`Worker ${processId} listening on port ${port}`);
  });
}

bootstrap();
