import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const theme = new SwaggerTheme();
  const config = new DocumentBuilder()
    .setTitle('Backloggist API')
    .setDescription('API for managing your backlog of games, books, movies, etc.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV !== 'production') {
    const fs = await import('fs');
    const path = await import('path');
    fs.writeFileSync(
      path.resolve(process.cwd(), 'swagger.json'),
      JSON.stringify(document, null, 2),
    );
  }

  SwaggerModule.setup('docs', app, document, {
    swaggerUrl: '/docs',
    customSiteTitle: 'Backloggist API',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
    },
    customCss: theme.getBuffer(SwaggerThemeNameEnum.NORD_DARK),
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap()
  .then(() => {
    console.log('🚀 Application started successfully');
  })
  .catch((error) => {
    console.error('🚀 Application failed to start:', error);
    process.exit(1);
  });
