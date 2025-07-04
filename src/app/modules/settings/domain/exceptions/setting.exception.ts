import { ErrorData, Exception } from 'src/system/exceptions';

export class SettingException extends Exception {
  constructor({ code = '400', path = '/', message = 'Error interno' }: Partial<ErrorData>) {
    super({
      code: `${code}`,
      path,
      message,
    });
  }
}
