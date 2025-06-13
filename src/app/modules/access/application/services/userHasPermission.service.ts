import { Inject, Injectable } from '@nestjs/common';
import { IPermission } from '../../domain/models';
import { IGetUserRolesRepository } from '../../domain/ports/repositories';

@Injectable()
export class UserHasPermissionService {
  constructor(
    @Inject('IGetUserRolesRepository')
    private readonly getUserRoles: IGetUserRolesRepository,
  ) {}

  async run(userId: string, required: IPermission[]): Promise<boolean> {
    const roles = await this.getUserRoles.getRolesById(userId);

    if (roles.some((role) => role.options?.isAdmin)) {
      return true;
    }

    return required.every((requiredPermission) =>
      roles.some((role) => {
        const rolePermission = role.permissions?.find((p) => p.resource.toUpperCase() === requiredPermission.resource.toUpperCase());
        if (!rolePermission) return false;

        const requiredApi = requiredPermission.actions.api || [];
        const userApi = rolePermission.actions.api || [];

        // Soporte para "TODO"
        if (requiredApi.includes('TODO')) {
          return userApi.length > 0; // Basta con que tenga alguna acción
        }

        return requiredApi.every((action) => userApi.includes(action));
      }),
    );
  }
  
}
