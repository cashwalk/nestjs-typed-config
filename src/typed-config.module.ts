import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { BaseTypedConfigService } from './base-typed-config.service';
import { FactoryProvider } from '@nestjs/common';

export class TypedConfigModule {
  static forRoot(
    configService: typeof BaseTypedConfigService<any>,
    options: ConfigModuleOptions,
  ) {
    const configModule = ConfigModule.forRoot(options);
    const [originalProvider] = configModule.providers as [FactoryProvider];
    originalProvider.provide = configService;
    configModule.exports![0] = configService;
    return configModule;
  }
}
