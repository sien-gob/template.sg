import { IPermission } from '../models';

export class RoleDto {
  constructor(data?: Partial<RoleDto>) {
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
