import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ClientScope } from '../clients/clientScope';
import { TagItem } from '../tags/tagItem';
import GraphQLJSON from 'graphql-type-json';
import { Auditable } from '../audits/auditable';

@ObjectType('Metadata')
@InputType('MetadataInput')
export class Metadata<P = any> {
  constructor(data?: Partial<Metadata<P>>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @Field(() => ClientScope)
  scope: ClientScope;

  @Field(() => Auditable, { nullable: true })
  auditable?: Auditable;

  @Field(() => GraphQLJSON, { nullable: true })
  properties?: P;

  @Field(() => [TagItem], { nullable: true })
  tags?: TagItem[];

  @Field()
  rowversion: string;
}
