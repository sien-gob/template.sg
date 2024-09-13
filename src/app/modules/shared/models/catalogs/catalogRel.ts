import { Field, InputType, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType('CatalogRel')
@InputType('CatalogRelInput')
export class CatalogRel {
  constructor(data?: Partial<CatalogRel>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @Field() id: string;
  @Field() type: string;

  @Field(() => GraphQLJSON, { nullable: true })
  properties?: {
    context: string;
  };
}
