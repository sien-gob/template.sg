import { TagItem } from '../tags/tagItem';
import { Field, InputType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType('CreateDtoInput')
export abstract class CreateDto<P> {
  @Field(() => GraphQLJSON, { nullable: true })
  properties?: P;

  @Field(() => [TagItem], { nullable: true })
  tags?: TagItem[];
}
