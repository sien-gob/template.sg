import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SKIP_VERSION_CHECK } from '../decorators';
import { GetCurrentVersionService } from '../../application/services';
import { Exception } from 'src/system/exceptions';

@Injectable()
export class VersionValidationGuard implements CanActivate {
  private readonly logger = new Logger(VersionValidationGuard.name);

  // LISTA BLANCA INTERNA - Rutas que NO requieren validación
  private readonly whitelist = ['/api/docs', '/auth/login', '/auth/refresh', 'systemInfo', 'version', '/config/version'];

  constructor(
    private readonly reflector: Reflector,
    private readonly versionService: GetCurrentVersionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routePath = this.getRoutePath(context);

    if (this.isExecuted(context)) {
      //this.logger.debug(`Guard ya ejecutado en esta request.`);
      return true;
    }

    // 1. Decorador manual
    const skipValidation = this.reflector.getAllAndOverride<boolean>(SKIP_VERSION_CHECK, [context.getHandler(), context.getClass()]);
    if (skipValidation) {
      //this.logger.debug('Validación omitida por decorator @SkipVersionCheck');
      return true;
    }

    // 2. Lista blanca
    if (this.isInWhitelist(routePath)) {
      //this.logger.debug(`Ruta en lista blanca: ${routePath}`);
      return true;
    }

    // 3. Validación de versiones
    const versionInfo = await this.versionService.run();
    if (versionInfo?.app?.codigo !== versionInfo?.db?.codigo) {
      this.logger.error(`Error al validar versiones de base de datos app: ${versionInfo?.app?.codigo} db: ${versionInfo?.db?.codigo}`);
      throw new Exception({ code: 'VERSION', path: 'version', message: 'Versión no compactible' });

      return false;
    }

    //this.logger.debug(`Versiones correctas: app: ${versionInfo?.app?.codigo} db: ${versionInfo?.db?.codigo}`);
    return true;
  }

  private isExecuted(context: ExecutionContext): boolean {
    let request: any;

    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest();
    } else if (context.getType<any>() === 'graphql') {
      request = GqlExecutionContext.create(context).getContext().req;
    } else {
      return false; // Para otros tipos de contexto, ignoramos la bandera.
    }

    if (request.__versionGuardExecuted) {
      return true;
    }

    request.__versionGuardExecuted = true;
    return false;
  }

  private getRoutePath(context: ExecutionContext): string {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      return request.url.split('?')[0];
    } else if (context.getType<any>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      return gqlContext.getInfo().fieldName;
    }
    return '';
  }

  private isInWhitelist(routePath: string): boolean {
    return this.whitelist.some((whitelistPath) => {
      return routePath === whitelistPath || routePath.includes(whitelistPath);
    });
  }
}

/*
private getRouteInfo(context: ExecutionContext): string {
  if (context.getType() === 'http') {
    const request = context.switchToHttp().getRequest();
    return `${request.method} ${request.url}`;
  } else if (context.getType<any>() === 'graphql') {
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    return `GraphQL ${info.operation.operation} ${info.fieldName}`;
  }
  return 'Unknown route';
}
  */
