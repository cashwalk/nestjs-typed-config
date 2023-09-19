# nestjs-typed-config (ENG)

[KOR](./README.ko.md)

`nestjs-typed-config` is type-safe nestjs config module & service.
You can use ConfigService with type-safety, without additional type-casting.

What you need to do is just define your joi schema with typing, and pass it through module and service.

You can use all options in ConfigModule.forRoot, and you can also use all features in ConfigService.
This will make your migration from ConfigModule to TypedConfigModule easier.
Plus, you can also use ConfigService from `@nestjs/config` without any additional changes.
TypedConfigModule also provide dependency injection for original ConfigService, so you can migrate your code step by step.

## install
```bash
npm install nestjs-typed-config
```

## createTypedConfig
By calling createTypedConfig, you can create TypedConfigService and TypedConfigModule.
And then, you change your all ConfigModule to generated TypedConfigModule.
Also, you can use TypedConfigService instead of ConfigService.
```typescript
// typed-config.ts
import { createTypedConfig } from 'src/my-npm';
import * as Joi from 'joi';

export const { TypedConfigService, TypedConfigModule } = createTypedConfig({
  DB_PASSWORD: Joi.string().required(),
  DB_PORT: Joi.number().required(),
});

export type TypedConfigService = InstanceType<typeof TypedConfigService>; // Must declare use this 
```

## Resolving Joi schema
If you just want to use TypedConfigService, you will not need this.
It transforms joi schema type to plain object type.
```typescript
import { ResolveJoiSchema } from 'nestjs-typed-config';

// EnvType will be { NODE_ENV: string; PORT: number; }
type EnvType = ResolveJoiSchema<typeof envSchema>;
````

## example

You should set up typed config module&service like below.
```typescript
import { Module } from '@nestjs/common';
import { createTypedConfig } from 'src/my-npm';
import * as Joi from 'joi';

export const { TypedConfigService, TypedConfigModule } = createTypedConfig({
  PORT: Joi.number().required(),
  NODE_ENV: Joi.string().required(),
});

export type TypedConfigService = InstanceType<typeof TypedConfigService>; // Must declare use this

// use TypedConfigModule.forRoot instead of ConfigModule.forRoot when you initialize your app
@Module({
  imports: [
    TypedConfigModule.forRoot(TypedConfigService, {
      isGlobal: true,
      validationSchema: envSchema,
    }),
  ],
})
export class AppModule {}
```

Then you can use TypedConfigService like below.
```typescript
@Injectable()
export class AppService {
  constructor(private readonly configService: TypedConfigService) {} // use TypedConfigService instead of ConfigService

  foo() {
    const nodeEnv = configService.get('NODE_ENV'); // infer type as string
    const port = configService.get('PORT'); // infer type as number
    const host = configService.get('HOST'); // compile error. HOST is not in schema
    const port2: boolean = configService.get('PORT'); // compile error. number is not assignable to boolean
  }
}
```