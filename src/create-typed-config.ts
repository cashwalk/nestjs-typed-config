import { DynamicModule, Injectable, Module } from '@nestjs/common';
import {
  ConfigFactory,
  ConfigModule,
  ConfigModuleOptions,
  ConfigService,
  Path,
  PathValue,
} from '@nestjs/config';
import Joi, { SchemaMap } from 'joi';
import { ResolveJoiSchema } from './types/resolve-joi-schema';

export const createTypedConfig = <T extends SchemaMap>(schema: T) => {
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
      defaultValue?: PathValue<ResolvedSchema, P> | undefined,
    ): PathValue<ResolvedSchema, P>;

    get<P extends Path<ResolvedSchema> = any>(
      propertyPath: P,
      defaultValue?: PathValue<ResolvedSchema, P> | undefined,
    ): PathValue<ResolvedSchema, P> {
      if (defaultValue !== undefined)
        return this.configService.get(propertyPath, defaultValue);
      return this.configService.get(propertyPath);
    }

    getOrThrow<P extends Path<ResolvedSchema> = any>(
      propertyPath: P,
    ): Exclude<PathValue<ResolvedSchema, P>, undefined>;

    getOrThrow<P extends Path<ResolvedSchema> = any>(
      propertyPath: P,
      defaultValue?: PathValue<ResolvedSchema, P> | undefined,
    ): Exclude<PathValue<ResolvedSchema, P>, undefined>;

    getOrThrow<P extends Path<ResolvedSchema> = any>(
      propertyPath: P,
      defaultValue?: PathValue<ResolvedSchema, P> | undefined,
    ): Exclude<PathValue<ResolvedSchema, P>, undefined> {
      if (defaultValue !== undefined)
        return this.configService.getOrThrow(propertyPath, defaultValue);
      return this.configService.getOrThrow(propertyPath);
    }
  }

  @Module({
    imports: [ConfigModule],
    providers: [TypedConfigService],
    exports: [ConfigModule, TypedConfigService],
  })
  class TypedConfigModule {
    static async forRoot(
      options: Omit<ConfigModuleOptions, 'validationSchema'>,
    ): Promise<DynamicModule> {
      const loadedConfig = await Promise.all(
        (options.load || []).map(async (fn) => {
          const resolvedFn = await Promise.resolve(fn);
          return resolvedFn();
        }),
      );

      const mergedConfig = Object.assign({}, ...loadedConfig, process.env);

      const { error, value: validatedConfig } = joiSchema.validate(
        mergedConfig,
        {
          allowUnknown: true,
          abortEarly: false,
        },
      );

      if (error) {
        throw new Error(`Configuration validation error: ${error.message}`);
      }

      Object.assign(process.env, validatedConfig);

      return {
        module: TypedConfigModule,
        global: options.isGlobal,
        imports: [
          ConfigModule.forRoot({
            ...options,
            load: [() => validatedConfig],
            validationSchema: joiSchema,
          }),
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
};
