import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

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
