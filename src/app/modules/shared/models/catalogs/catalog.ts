import { Field, InputType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType('CatalogInput')
export class CatalogInput {
  constructor(data?: Partial<CatalogInput>) {
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
