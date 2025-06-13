import { IPermission } from '../models';

export class RoleEntity {
  constructor(data?: Partial<RoleEntity>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  id: string;
  name: string;
  options: {
    isAdmin: boolean;
    isSystem?: boolean;
    isHidden?: boolean;
    isDisabled?: boolean;
  };
  permissions?: IPermission[];
}
