import { Field, InputType } from '@nestjs/graphql';

@InputType('ClientScopeInput')
export class ClientScopeInput {
  constructor(data?: ClientScopeInput) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @Field()
  clientId: string;

  @Field()
  appId: string;

  //@Field(() => GraphQLJSON, { nullable: true })
  properties?: {
    context: string;
  };
}
