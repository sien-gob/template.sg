import { RoleEntity } from '../../entities';

export interface IGetRolesByIdRepository {
  getRolesById(roleIds: string[]): Promise<RoleEntity[]>;
}
