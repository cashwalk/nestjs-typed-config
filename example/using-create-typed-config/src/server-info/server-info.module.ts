import { Module } from '@nestjs/common';
import { ServerInfoController } from './server-info.controller';
import { TypedConfigModule } from '../typed-config';

@Module({
  imports: [TypedConfigModule],
  controllers: [ServerInfoController],
})
export class ServerInfoModule {}
