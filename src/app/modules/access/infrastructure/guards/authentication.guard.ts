import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { AuthException } from '../../domain/exceptions';
import { AuthenticationService } from '../../application/services';
import { CustomRequest } from 'src/app/modules/shared/models';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly authService: AuthenticationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isGraphQL = context.getType<'graphql' | 'http'>() === 'graphql';
    const req: CustomRequest = isGraphQL ? GqlExecutionContext.create(context).getContext().req : context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new AuthException({
        code: 'UNAUTHORIZED',
        path: 'Authentication',
        message: 'Token de autorización no proporcionado',
      });
    }

    const userPayload = await this.authService.run(token);

    // Puedes guardar el usuario en el contexto para usarlo luego en tus resolvers o controladores

    if (isGraphQL) {
      const ctx = GqlExecutionContext.create(context);
      ctx.getContext().context = userPayload;
    }
    req.context = userPayload;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
  }
}
