import { ErrorData } from './error.model';
import { Exception } from './generic.exception';
import { NestValidationPipeException } from './nestValidationPipe.exception';
import { ValidatorException } from './validator.exception';

export class ErrorProcessor {
  private static errorHandlers = [Exception, ValidatorException, NestValidationPipeException];

  static processError(err: Error): ErrorData[] {
    for (const errorType of this.errorHandlers) {
      if (err instanceof errorType) return err.getErrors();
    }
    return [
      {
        code: '500',
        path: '/',
        message: err.message,
      },
    ];
  }
}
