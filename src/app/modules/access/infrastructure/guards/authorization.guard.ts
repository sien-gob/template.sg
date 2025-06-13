import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { PERMISSIONS_KEY } from '../decorators';
import { IPermission } from '../../domain/models';
import { UserHasPermissionService } from '../../application/services';
import { AuthException } from '../../domain/exceptions';
import { JwtPayloadAccess } from '../../domain/payloads';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userHasPermissionService: UserHasPermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isGraphQL = context.getType<'graphql' | 'http'>() === 'graphql';

    const req = isGraphQL ? GqlExecutionContext.create(context).getContext().req : context.switchToHttp().getRequest();

    const payload: JwtPayloadAccess = req?.context;

    if (!payload) {
      throw new AuthException({
        code: 'AUTHORIZATION',
        path: 'GUARD',
        message: 'Usuario no encontrado',
      });
    }

    const routePermissions: IPermission[] = this.reflector.getAllAndOverride(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!routePermissions) {
      return true; // No se definieron permisos explícitos
    }

    const access = await this.userHasPermissionService.run(payload.access.user.userId, routePermissions);

    if (!access) {
      throw new AuthException({
        code: 'FORBIDDEN',
        message: 'El usuario no tiene permiso para acceder a este recurso',
      });
    }

    return true;
  }
}
