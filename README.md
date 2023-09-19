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
By calling createTypedConfig, you can create TypedConfigService & TypedConfigModule.
And then, you change your all ConfigModule to generated TypedConfigModule.
Now, you can use TypedConfigService instead of ConfigService.

Below code is example of generating TypedConfigService and TypedConfigModule.
You should write below code in your own project.
```typescript
// typed-config.ts
import { createTypedConfig } from 'src/my-npm';
import * as Joi from 'joi';

export const { TypedConfigService, TypedConfigModule } = createTypedConfig({
  DB_PASSWORD: Joi.string().required(),
  DB_PORT: Joi.number().required(),
});

export type TypedConfigService = InstanceType<typeof TypedConfigService>; // must declare this! 
```

## Resolving Joi schema
If you just want to use TypedConfigService, you will not need this.
It transforms joi schema type to plain object type.
```typescript
import { ResolveJoiSchema } from 'nestjs-typed-config';

type EnvType = ResolveJoiSchema<typeof envSchema>; // EnvType will be { NODE_ENV: string; PORT: number; }
````

## example

You should write below code to generate TypedConfig in your own project.
```typescript
// src/typed-config.ts
import { createTypedConfig } from 'nestjs-typed-config';
import * as Joi from 'joi';

// parameter should be composed with joi. not wrapped with joi.object()
export const { TypedConfigService, TypedConfigModule } = createTypedConfig({
  DB_PASSWORD: Joi.string().required(),
  DB_PORT: Joi.number().required(),
});

export type TypedConfigService = InstanceType<typeof TypedConfigService>; // must declare this!
```

Import TypedConfigModule from `src/typed-config.ts` instead of ConfigModule from `@nestjs/config`.
```typescript
// src/app.module.ts
import { TypedConfigModule } from './typed-config';

@Module({
  imports: [
    TypedConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

Import TypedConfigService from `src/typed-config.ts` instead of ConfigService from `@nestjs/config`.
```typescript
// src/app.service.ts
import { TypedConfigService } from './typed-config';

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