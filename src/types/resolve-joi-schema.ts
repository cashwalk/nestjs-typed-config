import Joi from 'joi';

type ResolveScalarJoiType<T> = T extends Joi.StringSchema
  ? string
  : T extends Joi.NumberSchema
  ? number
  : T extends Joi.BooleanSchema
  ? boolean
  : T extends Joi.DateSchema
  ? Date
  : T extends Joi.BinarySchema
  ? Buffer
  : T extends Joi.FunctionSchema
  ? Function
  : T extends Joi.AnySchema<infer U>
  ? U
  : T;

type UnArray<T> = T extends Array<infer U> ? U : T;

type ResolveJoiType<T> = T extends Joi.ObjectSchema<infer U>
  ? // eslint-disable-next-line no-use-before-define
    { [key in keyof U]: ResolveJoiSchema<U[key]> }
  : T extends Joi.ArraySchema<infer U>
  ? // eslint-disable-next-line no-use-before-define
    ResolveJoiSchema<UnArray<U>>[]
  : ResolveScalarJoiType<T>;

type ResolvePrimitiveType<T> = T extends object
  ? // eslint-disable-next-line no-use-before-define
    { [key in keyof T]: ResolveJoiSchema<T[key]> }
  : T extends Array<infer U>
  ? // eslint-disable-next-line no-use-before-define
    ResolveJoiSchema<U>[]
  : T;

export type ResolveJoiSchema<T> = T extends Joi.AnySchema
  ? ResolveJoiType<T>
  : ResolvePrimitiveType<T>;
