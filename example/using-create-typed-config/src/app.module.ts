import { Module } from '@nestjs/common';
import { ServerInfoModule } from './server-info/server-info.module';
import { TypedConfigModule } from './typed-config';

@Module({
  imports: [
    ServerInfoModule,
    TypedConfigModule.forRoot({
      cache: true,
    }),
  ],
})
export class AppModule {}
