import { IGetRolesByIdRepository, IGetUserRolesRepository } from 'src/app/modules/access/domain/ports/repositories';
import { RoleEntity } from '../../../domain/entities';
import { UserException } from '../../../domain/exceptions';
import { Inject, Injectable } from '@nestjs/common';
import { mockUsers } from './data.mocks';

@Injectable()
export class GetUserRolesByIdMockAdapter implements IGetUserRolesRepository {
  constructor(
    @Inject('IGetRolesByIdRepository')
    private readonly getRoles: IGetRolesByIdRepository,
  ) {}

  async getRolesById(userId: string): Promise<RoleEntity[]> {
    const user = mockUsers.find((user) => user.userId.trim() === userId.trim());
    if (!user) {
      throw new UserException({ code: 'USER', path: 'UserService', message: 'Usuario no encontrado' });
    }
    return await this.getRoles.getRolesById(user.roles);
  }
}
