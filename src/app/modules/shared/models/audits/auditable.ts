import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType('Auditable')
@InputType('AuditableInput')
export class Auditable {
  constructor(data?: Partial<Auditable>) {
    const currentTime = new Date().toISOString();
    this.createdAt = currentTime;
    this.modifiedAt = currentTime;

    if (data) {
      Object.assign(this, data);
    }
  }

  @Field({ nullable: true })
  createdAt?: string;

  @Field({ nullable: true })
  modifiedAt?: string;

  @Field({ nullable: true })
  createdBy?: string;

  @Field({ nullable: true })
  modifiedBy?: string;

  @Field({ nullable: true })
  createdOrigin?: string;

  @Field({ nullable: true })
  modifiedOrigin?: string;
}
