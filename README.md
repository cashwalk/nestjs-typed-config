# nestjs-typed-config-module

`nestjs-typed-config-module` is type-safe nestjs config module & service.
You can use ConfigService with type-safety, without additional type-casting.

What you need to do is just define your joi schema with typing, and pass it through module and service.

You can use all options in ConfigModule.forRoot, and you can also use all features in ConfigService.
This will make your migration from ConfigModule to TypedConfigModule easier.

## example

You should set up typed config module&service like below.
```typescript
import { Module } from '@nestjs/common';
import { BaseTypedConfigService, TypedConfigModule } from 'nestjs-typed-config-module';
import Joi from 'joi';

// this is your env object
const envObject = {
  NODE_ENV: Joi.string(),
  PORT: Joi.number(),
};

// write like below to make BaseTypedConfigService infer type.
// Joi.object(envObject) will not infered well.
export const envSchema = Joi.object<typeof envObject>(envObject);

// give envSchema to BaseTypedConfigService
export class TypedConfigService extends BaseTypedConfigService<typeof envSchema> {}

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
    const nodeEnv = configService.get('NODE_ENV'); // typed config service will infer type as string, and return value also will be string
    const port = configService.get('PORT'); // typed config service will infer type as number, and return value also will be number
    const host = configService.get('HOST'); // compile error, since HOST is not in schema
    const port2: boolean = configService.get('PORT'); // compile error, since number is not assignable to type boolean
  }
}
```