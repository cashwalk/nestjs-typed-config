import { Module } from '@nestjs/common';
import { ServerInfoController } from './server-info.controller';

@Module({
  controllers: [ServerInfoController],
})
export class ServerInfoModule {}
