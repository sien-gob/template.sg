import { Field, InputType, Int } from '@nestjs/graphql';

@InputType('AuditInput')
export class AuditInput {
  @Field()
  createdAt: string;
  @Field()
  modifiedAt: string;

  @Field()
  createdBy: string;
  @Field()
  modifiedBy: string;
}
