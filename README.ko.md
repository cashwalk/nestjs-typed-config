# nestjs-typed-config (KOR)

[ENG](./README.md)

`nestjs-typed-config`은 nestjs 의 config module&service 의 타입 안전성을 강화한 버전입니다.
ConfigService 를 추가적인 타입 캐스팅 없이 타입 안정성을 보장하는 방식으로 사용 가능합니다.

joi schema 타이핑을 Module과 Service에 전달하기만 하면 끝입니다.

ConfigModule.forRoot의 모든 옵션을 사용 가능하며, ConfigService의 모든 기능을 사용 가능합니다.
이를 통해서 마이그레이션을 더 쉽게 진행할 수 있습니다.
또한, TypedConfigModule을 쓰더라도, 여전히 `@nestjs/config`의 ConfigService 도 그대로 사용 가능합니다.
TypedConfigModule도 기존의 ConfigService를 위한 dependency injection를 제공하며, 이를 통해서 단계적으로 마이그레이션해 나갈 수 있습니다.

[예제 코드](./example)에서 자세한 사용 예시를 볼 수 있습니다.

## 설치
```bash
npm install nestjs-typed-config
```

## createTypedConfig
createTypedConfig 를 호출해서, TypedConfigService & TypedConfigModule을 생성합니다.
그러고 나서, ConfigModule 들을 모두 TypedConfigModule으로 교체합니다.
이제, ConfigService 대신에 TypedConfigService를 사용할 수 있습니다.

아래 코드는 TypedConfigService & TypedConfigModule을 생성하는 예시입니다.
프로젝트에 아래 소스코드를 직접 추가해주셔야 합니다.
```typescript
// typed-config.ts
import { createTypedConfig } from 'src/my-npm';
import * as Joi from 'joi';

export const { TypedConfigService, TypedConfigModule } = createTypedConfig({
  DB_PASSWORD: Joi.string().required(),
  DB_PORT: Joi.number().required(),
});

export type TypedConfigService = InstanceType<typeof TypedConfigService>; // 반드시 선언해주세요! 
```

## Joi schema 해석기
TypedConfigService만 쓸 것이라면 필요하지 않은 내용입니다.
Joi 스키마를 plain object 타입으로 변환해줍니다.
```typescript
import { ResolveJoiSchema } from 'nestjs-typed-config';

// EnvType will be { NODE_ENV: string; PORT: number; }
type EnvType = ResolveJoiSchema<typeof envSchema>;
````

## example
더 자세한 예시는 [예제 코드](./example)에서 볼 수 있습니다.

프로젝트에 아래와 같은 코드를 작성해서 TypedConfig을 만들어 줍니다.
```typescript
// src/typed-config.ts
import { createTypedConfig } from 'nestjs-typed-config';
import * as Joi from 'joi';

export const { TypedConfigService, TypedConfigModule } = createTypedConfig({
  DB_PASSWORD: Joi.string().required(),
  DB_PORT: Joi.number().required(),
});

export type TypedConfigService = InstanceType<typeof TypedConfigService>; // 반드시 선언해주세요!
```

`@nestjs/config`의 ConfigModule 대신에 `src/typed-config.ts`의 TypedConfigModule를 임포트합니다.
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

`@nestjs/config`의 ConfigService 대신에 `src/typed-config.ts`의 TypedConfigService를 임포트합니다.
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