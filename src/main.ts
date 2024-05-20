import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http.exception';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionFilter } from './common/exceptions/all.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['verbose', 'debug', 'log', 'error'],
    // rawBody: true,
  });

  const configService: ConfigService = app.get(ConfigService);
  app.useGlobalFilters(new AllExceptionFilter(), new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.setGlobalPrefix('/api');
  app.enableCors();
  const config = new DocumentBuilder()
    .addBearerAuth()
    .addServer('/')
    .setTitle('API Document')
    .setDescription('API description')
    .setVersion('1.0')
    // .addTag('nope')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      apisSorter: 'alpha',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      persistAuthorization: true,
    },
    customCss:
      'body { padding-bottom: 4rem; } .swagger-ui section.models { display: none; }',
    customSiteTitle: 'Project API Document',
  });
  const port: number = configService.get<number>('PORT') || 3000;
  await app.listen(port, () => console.log('Listening on port: ', port));
}
bootstrap();
