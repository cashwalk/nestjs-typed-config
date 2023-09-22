import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServerInfoModule } from './server-info/server-info.module';
import { TypedConfigModule } from './typed-config';

@Module({
  imports: [
    ServerInfoModule,
    TypedConfigModule.forRoot({
      cache: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
