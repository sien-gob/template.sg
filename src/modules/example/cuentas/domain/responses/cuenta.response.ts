import { Field, ObjectType } from '@nestjs/graphql';
import { CuentaDto } from '../dtos';
import { GQLResponse } from 'src/system/response';

@ObjectType()
export class CuentaResponse extends GQLResponse {
  @Field(() => CuentaDto, { nullable: true })
  data: CuentaDto;
}
