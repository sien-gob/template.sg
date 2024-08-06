export interface AccessScope {
  clientId: string;
  appId: string;
}

export interface User {
  userId: string;
  username: string;
}

export interface Access {
  scope: AccessScope;
  user: User;
}

export interface RequestContext {
  access: Access;
}
