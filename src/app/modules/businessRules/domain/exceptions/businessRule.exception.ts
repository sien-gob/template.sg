import { ErrorData, Exception } from 'src/system/exceptions';

export class BussinesRuleException extends Exception {
  constructor({ code = '401', path = '/', message = 'Error en la regla de negocio' }: Partial<ErrorData>) {
    super({
      code: `${code}`,
      path,
      message,
    });
  }
}
