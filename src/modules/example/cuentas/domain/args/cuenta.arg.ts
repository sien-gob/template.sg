import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNumber } from 'class-validator';

@InputType('GetCuentaByCodigoInput')
export class GetCuentaByCodigoInput {
  @Field() codigo: string;
}
