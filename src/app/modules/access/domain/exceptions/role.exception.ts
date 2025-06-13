import { ErrorData, Exception } from 'src/system/exceptions';

export class RoleException extends Exception {
  constructor({ code = '400', path = '/', message = 'Error en rol' }: Partial<ErrorData>) {
    super({
      code: `${code}-ROLE`,
      path,
      message,
    });
  }
}
