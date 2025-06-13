import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestId = uuidv4();

    // Para HTTP requests (REST)
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();

      request.requestId = requestId;
      response.setHeader('X-Request-ID', requestId);
    }

    // Para GraphQL resolvers
    if (context.getType<any>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const ctx = gqlContext.getContext();

      // Guardar requestId en el contexto
      ctx.requestId = requestId;

      // Intentar acceder al response para establecer header
      const res = ctx.res || ctx.response;
      if (res && typeof res.setHeader === 'function') {
        res.setHeader('X-Request-ID', requestId);
      }
    }

    return next.handle();
  }
}
