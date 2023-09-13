import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NoInferType, Path, PathValue } from '@nestjs/config/dist/types';
import { ResolveJoiSchema } from './types/resolve-joi-schema';

@Injectable()
export class BaseTypedConfigService<T> extends ConfigService<
  ResolveJoiSchema<T>,
  true
> {
  private readonly inferOption = { infer: true } as const;

  get<P extends Path<ResolveJoiSchema<T>> = any>(
    propertyPath: P,
  ): PathValue<ResolveJoiSchema<T>, P>;

  get<P extends Path<ResolveJoiSchema<T>> = any>(
    propertyPath: P,
    defaultValue?: NoInferType<PathValue<ResolveJoiSchema<T>, P>>,
  ): PathValue<ResolveJoiSchema<T>, P>;

  get<P extends Path<ResolveJoiSchema<T>> = any>(
    propertyPath: P,
    defaultValue?: NoInferType<PathValue<ResolveJoiSchema<T>, P>>,
  ): PathValue<ResolveJoiSchema<T>, P> {
    if (defaultValue)
      return super.get(propertyPath, defaultValue, this.inferOption);
    return super.get(propertyPath, this.inferOption);
  }
}
