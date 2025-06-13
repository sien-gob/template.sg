import { UserScope } from '../models';

export interface JwtPayloadAccess {
  access: {
    scope: UserScope;
    user: {
      userId: string;
      username: string;
      roles?: string[];
    };
    apikey: string;
  };
}
