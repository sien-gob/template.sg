import { Field, InputType, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

type TagValue = string | number | boolean | Record<string, any>;

@ObjectType('TagItem')
@InputType('TagItemInput')
export class TagItem {
  @Field()
  key: string;

  @Field(() => GraphQLJSON)
  value: TagValue;
}
