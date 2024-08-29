import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType('Audit')
@InputType('AuditInput')
export class Audit {
  @Field()
  createdAt: string;
  @Field()
  modifiedAt: string;

  @Field()
  createdBy: string;
  @Field()
  modifiedBy: string;

  @Field()
  createdOrigin: string;
  @Field()
  modifiedOrigin: string;
}
