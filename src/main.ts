import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };

  app.enableCors(options);
  // const configService = app.get(ConfigService);
  // const PORT = configService.get('PORT');
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  const PORT = process.env.PORT;
  await app.listen(PORT || 5050, () =>
    Logger.log(`Server start on port ${PORT || 5050}`),
  );
}
bootstrap();
