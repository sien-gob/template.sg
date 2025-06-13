import { Injectable } from '@nestjs/common';
import { RoleEntity } from 'src/app/modules/access/domain/entities';
import { RoleException } from 'src/app/modules/access/domain/exceptions';
import { IGetRolesByIdRepository } from 'src/app/modules/access/domain/ports/repositories';
import { mockRoles } from './data.mocks';

@Injectable()
export class GetRolesByIdMockAdapter implements IGetRolesByIdRepository {
  

  async getRolesById(roleIds: string[]): Promise<RoleEntity[]> {
    const foundRoles = mockRoles.filter((role) => roleIds.includes(role.id));

    /*
      if (foundRoles.length !== roleIds.length) {
        const missingRoles = roleIds.filter((id) => !foundRoles.some((role) => role.id === id));
        throw new RoleException({
          code: 'ROLE_NOT_FOUND',
          path: 'GetRolesByIdsService',
          message: `Los siguientes roles no fueron encontrados: ${missingRoles.join(', ')}`,
        });
      }
    */

    return foundRoles;
  }
}
