import { ClientScopeInput } from '../clients/clientScope';
import { AuditInput } from '../audits/audit';
import { TagItem } from '../tags/tagItem';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@ObjectType('Dto')
@InputType('DtoInput')
export abstract class Dto<ID, P> {
  @IsNotEmpty({ message: 'El ámbito del cliente es requerido' })
  @Field(() => ClientScopeInput)
  scope: ClientScopeInput;

  @IsNotEmpty({ message: 'Las propiedad auditable es requerido' })
  @Field(() => AuditInput)
  audit: AuditInput;

  @IsNotEmpty({ message: 'El id es requerido' })
  @Field(() => GraphQLJSON)
  id: ID;

  @Field(() => GraphQLJSON, { nullable: true })
  properties?: P;
  tags?: TagItem[];
}
