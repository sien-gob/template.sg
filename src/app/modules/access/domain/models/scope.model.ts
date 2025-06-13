import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType('UserScope')
@InputType('UserScopeInput')
export class UserScope {
  constructor(data?: UserScope) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @Field() domain: string;
  @Field() subdomain: string;
  @Field(() => [String]) apps: string[];

  //@Field(() => GraphQLJSON, { nullable: true })
  properties?: {
    context: string;
  };
}
