/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FilterCondition } from 'src/app/modules/shared/common';

export class SyslogFilterDto {
  constructor(data?: Partial<SyslogFilterDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  filter?: FilterCondition;
}
