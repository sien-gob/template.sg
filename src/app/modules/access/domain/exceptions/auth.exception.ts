import { ErrorData, Exception } from 'src/system/exceptions';

export class AuthException extends Exception {
  constructor({ code = '400', path = '/', message = 'Error en Autenticación' }: Partial<ErrorData>) {
    super({
      code: `${code}-AUTH`,
      path,
      message,
    });
  }
}
