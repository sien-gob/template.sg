import { Field, InputType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

type TagValue = string | number | boolean | Record<string, any>;

@InputType('TagItem')
export class TagItem {
  @Field()
  key: string;

  @Field(() => GraphQLJSON)
  value: TagValue;
}

