import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateCuentaDto {
  constructor(data?: Partial<UpdateCuentaDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @Field() nombre: string;
  @Field() descripcion: string;
}
