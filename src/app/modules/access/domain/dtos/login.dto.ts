import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class LoginDto {
  constructor(data?: Partial<LoginDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @Field() userId: string;
  @Field() username: string;
  @Field() token: string;
  @Field() refreshToken: string;
}
