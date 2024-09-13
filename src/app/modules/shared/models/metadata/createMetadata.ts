import { Field, InputType } from '@nestjs/graphql';
import { ClientScope } from '../clients/clientScope';
import { TagItem } from '../tags/tagItem';
import GraphQLJSON from 'graphql-type-json';
import { Auditable } from '../audits/auditable';

@InputType('CreateMetadataInput')
export class CreateMetadata<P = any> {
  constructor(data?: Partial<CreateMetadata<P>>) {
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
}
