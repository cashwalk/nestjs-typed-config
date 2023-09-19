import { DynamicModule, Injectable, Module } from '@nestjs/common';
import {
  ConfigFactory,
  ConfigModule,
  ConfigModuleOptions,
  ConfigService,
  Path,
  PathValue,
  NoInferType,
} from '@nestjs/config';
import Joi, { SchemaMap } from 'joi';
import { ResolveJoiSchema } from './types/resolve-joi-schema';

const TYPED_CONFIG_SERVICE_INJECT_TOKEN = Symbol('TYPED_CONFIG_SERVICE');

export function createTypedConfig<T extends SchemaMap>(schema: T) {
  const joiSchema = Joi.object<typeof schema>(schema);

  type ResolvedSchema = ResolveJoiSchema<typeof schema>;

  @Injectable()
  class TypedConfigService {
    constructor(public configService: ConfigService<ResolvedSchema, true>) {}

    get<P extends Path<ResolvedSchema> = any>(
      propertyPath: P,
    ): PathValue<ResolvedSchema, P>;

    get<P extends Path<ResolvedSchema> = any>(
      propertyPath: P,
      defaultValue?: NoInferType<PathValue<ResolvedSchema, P>>,
    ): PathValue<ResolvedSchema, P>;

    get<P extends Path<ResolvedSchema> = any>(
      propertyPath: P,
      defaultValue?: NoInferType<PathValue<ResolvedSchema, P>>,
    ): PathValue<ResolvedSchema, P> {
      if (defaultValue)
        return this.configService.get(propertyPath, defaultValue);
      return this.configService.get(propertyPath);
    }

    getOrThrow<P extends Path<ResolvedSchema> = any>(
      propertyPath: P,
    ): Exclude<PathValue<ResolvedSchema, P>, undefined>;

    getOrThrow<P extends Path<ResolvedSchema> = any>(
      propertyPath: P,
      defaultValue?: NoInferType<PathValue<ResolvedSchema, P>>,
    ): Exclude<PathValue<ResolvedSchema, P>, undefined>;

    getOrThrow<P extends Path<ResolvedSchema> = any>(
      propertyPath: P,
      defaultValue?: NoInferType<PathValue<ResolvedSchema, P>>,
    ): Exclude<PathValue<ResolvedSchema, P>, undefined> {
      if (defaultValue)
        return this.configService.getOrThrow(propertyPath, defaultValue);
      return this.configService.getOrThrow(propertyPath);
    }
  }

  @Module({
    imports: [ConfigModule],
    providers: [
      {
        provide: TYPED_CONFIG_SERVICE_INJECT_TOKEN,
        useClass: TypedConfigService,
      },
    ],
    exports: [ConfigModule, TypedConfigService],
  })
  class TypedConfigModule {
    static forRoot(
      options: Omit<ConfigModuleOptions, 'validateSchema'> = {},
    ): DynamicModule {
      const { isGlobal, ...other } = options;

      return {
        module: TypedConfigModule,
        global: isGlobal,
        imports: [
          ConfigModule.forRoot({
            ...other,
            validationSchema: joiSchema,
          }),
        ],
        providers: [
          {
            provide: TypedConfigService,
            useFactory: (typedConfigService: TypedConfigService) => {
              (typedConfigService as any).isCacheEnabled = !!options.cache;
              return typedConfigService;
            },
            inject: [TYPED_CONFIG_SERVICE_INJECT_TOKEN],
          },
        ],
      };
    }

    static forFeature(config: ConfigFactory): DynamicModule {
      return {
        module: TypedConfigModule,
        imports: [ConfigModule.forFeature(config)],
      };
    }
  }

  return { TypedConfigModule, TypedConfigService };
}
