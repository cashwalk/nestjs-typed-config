import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { BaseTypedConfigService } from './base-typed-config.service';

const TYPED_CONFIG_SERVICE_INJECT_TOKEN = Symbol('TYPED_CONFIG_SERVICE');

export class TypedConfigModule {
  static forRoot(
    configService: typeof BaseTypedConfigService<any>,
    options: ConfigModuleOptions,
  ) {
    const configModule = ConfigModule.forRoot(options);
    configModule.providers?.push({
      provide: TYPED_CONFIG_SERVICE_INJECT_TOKEN,
      useClass: configService,
    });
    configModule.providers?.push({
      provide: configService,
      useFactory: (typedConfigService: BaseTypedConfigService<any>) => {
        (typedConfigService as any).isCacheEnabled = !!options.cache;
        return typedConfigService;
      },
      inject: [TYPED_CONFIG_SERVICE_INJECT_TOKEN],
    });
    configModule.exports?.push(configService);
    return configModule;
  }
}
