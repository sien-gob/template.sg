import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateCuentaDto {
  constructor(data?: Partial<CreateCuentaDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @Field() id: string;
  @Field() codigo: string;
  @Field() nombre: string;
  @Field() descripcion: string;
}
