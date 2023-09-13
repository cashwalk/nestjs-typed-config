# nestjs-typed-config-module (KOR)

[ENG](./README.md)

`nestjs-typed-config-module`은 nestjs 의 config module&service 의 타입 안전성을 강화한 버전입니다.
ConfigService 를 추가적인 타입 캐스팅 없이 타입 안정성을 보장하는 방식으로 사용 가능합니다.

joi schema 타이핑을 Module과 Service에 전달하기만 하면 끝입니다.

ConfigModule.forRoot의 모든 옵션을 사용 가능하며, ConfigService의 모든 기능을 사용 가능합니다.
이를 통해서 마이그레이션을 더 쉽게 진행할 수 있습니다.

## example

다음과 같이 typed config module&service를 설정합니다.
```typescript
import { Module } from '@nestjs/common';
import { BaseTypedConfigService, TypedConfigModule } from 'nestjs-typed-config-module';
import Joi from 'joi';

// env object를 정의합니다.
const envObject = {
  NODE_ENV: Joi.string(),
  PORT: Joi.number(),
};

// 아래와 같이 써줘야 타입 추론이 가능합니다.
// Joi.object(envObject) 로 쓰면 안됩니다.
export const envSchema = Joi.object<typeof envObject>(envObject);

// envSchema를 BaseTypedConfigService에 넣어줍니다.
export class TypedConfigService extends BaseTypedConfigService<typeof envSchema> {}

// ConfigModule.forRoot 대신에 TypedConfigModule.forRoot를 써서 initialize 합니다
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

TypedConfigService 사용은 아래와 같이 합니다.
```typescript
@Injectable()
export class AppService {
  constructor(private readonly configService: TypedConfigService) {} // ConfigService 대신에 TypedConfigService를 씁니다 

  foo() {
    const nodeEnv = configService.get('NODE_ENV'); // string으로 타입을 추론해주며, 실제로 string을 리턴합니다.
    const port = configService.get('PORT'); // number으로 타입을 추론해주며, 실제로 number을 리턴합니다.
    const host = configService.get('HOST'); // HOST가 스키마에 없기에, compile error가 발생합니다.
    const port2: boolean = configService.get('PORT'); // number는 boolean에 할당할 수 없기에, compile error가 발생합니다.
  }
}
```