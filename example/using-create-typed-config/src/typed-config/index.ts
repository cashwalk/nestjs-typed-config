import { createTypedConfig } from 'nestjs-typed-config';
import * as Joi from 'joi';

export const { TypedConfigModule, TypedConfigService } = createTypedConfig({
  NODE_ENV: Joi.string(),
  PORT: Joi.number(),
  IS_TEST: Joi.boolean(),
  IS_PRODUCTION: Joi.boolean(),
  HELLO_MESSAGE: Joi.string(),
});
export type TypedConfigService = InstanceType<typeof TypedConfigService>;
