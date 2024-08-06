import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { GQLResponse } from 'src/system/response';

@ObjectType()
export class Version {
  @Field()
  type: string;

  @Field()
  ver: string;

  @Field(() => GraphQLJSON)
  info: {
    date: string;
    company: string;
  };
}

@ObjectType()
export class VersionResponse extends GQLResponse {
  @Field(() => [Version], { nullable: true })
  data: Version[];
}
