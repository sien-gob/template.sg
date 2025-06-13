import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType('ClientScope')
@InputType('ClientScopeInput')
export class ClientScope {
  constructor(data?: ClientScope) {
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
