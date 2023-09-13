# nestjs-typed-config-module (KOR)

[ENG](./README.md)

`nestjs-typed-config-module`은 nestjs 의 config module&service 의 타입 안전성을 강화한 버전입니다.
ConfigService 를 추가적인 타입 캐스팅 없이 타입 안정성을 보장하는 방식으로 사용 가능합니다.

joi schema 타이핑을 Module과 Service에 전달하기만 하면 끝입니다.

ConfigModule.forRoot의 모든 옵션을 사용 가능하며, ConfigService의 모든 기능을 사용 가능합니다.
이를 통해서 마이그레이션을 더 쉽게 진행할 수 있습니다.

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