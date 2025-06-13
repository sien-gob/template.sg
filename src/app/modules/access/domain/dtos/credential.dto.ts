import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CredentialDto {
  constructor(data?: Partial<CredentialDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  @Field()
  username: string;

  @IsNotEmpty({ message: 'El password de usuario es requerido' })
  @Field()
  password: string;
}
