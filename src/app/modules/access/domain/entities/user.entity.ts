import { UserScope } from "../models";

export class UserEntity {
  constructor(data?: Partial<UserEntity>) {
    if (data) {
      Object.assign(this, data);
    }
  }
  userId: string;
  scope: UserScope;
  name: string;
  password: string;
  roles: string[];
}
