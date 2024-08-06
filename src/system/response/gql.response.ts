import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorData } from 'src/system/exceptions';
import { Status } from './rest.response';

@ObjectType()
export abstract class GQLResponse {
  @Field(() => String)
  status: Status;

  @Field(() => [ErrorData], { nullable: true })
  errors: ErrorData[];
}