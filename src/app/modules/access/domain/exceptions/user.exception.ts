import { ErrorData, Exception } from "src/system/exceptions";


export class UserException extends Exception {
  constructor({ 
    code = "400", 
    path = "/", 
    message = "Error en user" }: Partial<ErrorData>) {
    super({
      code: `${code}-USER`,
      path,
      message,
    });
  }
}

