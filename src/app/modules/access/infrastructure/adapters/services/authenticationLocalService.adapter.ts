import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { IAuthenticationServicePort } from '../../../domain/ports/services';
import { AuthException } from '../../../domain/exceptions';
import { JwtPayloadAccess } from '../../../domain/payloads';

@Injectable()
export class AuthenticationLocalServiceAdapter implements IAuthenticationServicePort {
  constructor(private jwtService: JwtService) {}

  async autentication(token: string): Promise<JwtPayloadAccess> {
    if (!token) {
      throw new AuthException({
        code: 'MISSING_TOKEN',
        path: 'AUTHENTICATION_ADAPTER',
        message: 'Acceso denegado. Token no proporcionado.',
      });
    }

    try {
      return this.jwtService.verify(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new AuthException({
          code: 'TOKEN_EXPIRED',
          path: 'AUTHENTICATION_ADAPTER',
          message: 'Token expirado. Por favor, inicie sesión nuevamente.',
        });
      } else if (e instanceof JsonWebTokenError) {
        // Diferenciar entre token malformado y firma inválida
        if (e.message.includes('invalid signature')) {
          throw new AuthException({
            code: 'INVALID_SIGNATURE',
            path: 'AUTHENTICATION_ADAPTER',
            message: 'Token no válido. Firma corrupta o alterada.',
          });
        } else {
          throw new AuthException({
            code: 'INVALID_TOKEN',
            path: 'AUTHENTICATION_ADAPTER',
            message: 'Token inválido. Formato incorrecto.',
          });
        }
      } else {
        // Otros errores inesperados (ej: algoritmo no soportado)
        throw new AuthException({
          code: 'AUTH_ERROR',
          path: 'AUTHENTICATION_ADAPTER',
          message: 'Error de autenticación. Por favor, contacte al soporte.',
        });
      }
    }
  }
}
