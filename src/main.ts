import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Issue Tracker API')
    .setDescription('The Issue Tracker API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('issues', 'Issue management endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('notifications', 'Notification management endpoints')
    .addTag('slack', 'Slack integration endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(port);
}
bootstrap(); 