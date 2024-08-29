import { TagItem } from '../tags/tagItem';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
import { Audit } from '../audits/audit';

@ObjectType('Dto')
export abstract class Dto<P> {
  @IsNotEmpty({ message: 'Las propiedad auditable es requerido' })
  @Field(() => Audit)
  audit: Audit;

  @Field(() => GraphQLJSON, { nullable: true })
  properties?: P;

  @Field(() => TagItem)
  tags?: TagItem[];

  @IsNotEmpty({ message: 'La version del registro no puede ser vacio' })
  @Field()
  rowVersion: string;
}
