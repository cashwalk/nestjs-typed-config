import { Controller, Get, NotFoundException } from '@nestjs/common';
import { TypedConfigService } from '../typed-config';

@Controller('server-info')
export class ServerInfoController {
  constructor(private readonly configService: TypedConfigService) {}

  @Get('test-server')
  testServer() {
    const isTest = this.configService.get('IS_TEST');
    if (!isTest) {
      throw new NotFoundException('this only used in test server');
    }
    return this.configService.get('HELLO_MESSAGE');
  }

  @Get('production-server')
  productionServer() {
    const isTest = this.configService.get('IS_PRODUCTION');
    if (!isTest) {
      throw new NotFoundException('this only used in production server');
    }
    return this.configService.get('HELLO_MESSAGE');
  }

  @Get('node-env')
  nodeEnv() {
    return this.configService.get('NODE_ENV');
  }
}
