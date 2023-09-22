import { Controller, Get } from '@nestjs/common';
import { TypedConfigService } from './typed-config';

@Controller()
export class AppController {
  constructor(private readonly configService: TypedConfigService) {}

  @Get()
  getHello(): string {
    return this.configService.get('HELLO_MESSAGE');
  }
}
