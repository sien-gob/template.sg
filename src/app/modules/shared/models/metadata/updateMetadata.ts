import { Field, InputType } from '@nestjs/graphql';
import { ClientScope } from '../clients/clientScope';
import { TagItem } from '../tags/tagItem';
import GraphQLJSON from 'graphql-type-json';
import { Auditable } from '../audits/auditable';

@InputType('UpdateMetadataInput')
export class UpdateMetadata<P = any> {
  constructor(data?: Partial<UpdateMetadata<P>>) {
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
