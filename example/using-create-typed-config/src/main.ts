import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TypedConfigService } from './typed-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(TypedConfigService); // use TypedConfigService from your typed-config
  const PORT = configService.get('PORT'); // infer type automatically
  await app.listen(PORT);
}
bootstrap();
