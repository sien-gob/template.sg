import { UserScope } from "../models";

export class UserDto {
  constructor(data?: Partial<UserDto>) {
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
