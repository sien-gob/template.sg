import { ErrorData, Exception } from "src/system/exceptions";

export class DatabaseException extends Exception {
  constructor({ code = '400', path = '/', message = 'Error en repositorio' }: Partial<ErrorData>) {
    super({
      code: `${code}-DB`,
      path,
      message,
    });
  }
}
