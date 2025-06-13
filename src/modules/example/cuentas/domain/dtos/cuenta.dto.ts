import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CuentaDto {
  constructor(data?: Partial<CuentaDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @Field() id: string;
  @Field() codigo: string;
  @Field() nombre: string;
  @Field() descripcion: string;
}
