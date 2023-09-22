import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServerInfoModule } from './server-info/server-info.module';

@Module({
  imports: [ServerInfoModule],
  controllers: [AppController],
})
export class AppModule {}
