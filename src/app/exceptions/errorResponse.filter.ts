import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ErrorProcessor, NestValidationPipeException } from 'src/system/exceptions';

@Catch()
export class ErrorResponseFilter implements ExceptionFilter {
  async catch(rawException: Error, host: ArgumentsHost) {
    const isGraphQL = host.getType().toString() === 'graphql';

    let sendError: Error = rawException;

    //console.log(rawException);

    if (rawException instanceof BadRequestException) {
      const res = rawException.getResponse();
      const validationPipe = rawException?.stack?.toLowerCase().includes('validationpipe');
      if (validationPipe) {
        if (typeof res === 'object' && res.hasOwnProperty('message')) {
          const { message } = res as any;
          sendError = new NestValidationPipeException(Array.isArray(message) ? message : [message]);
        }
      }
    }

    const errs = ErrorProcessor.processError(sendError);

    if (isGraphQL) {
      return {
        status: 'error',
        data: null,
        errors: errs,
      };
    } else {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      await response.send({
        status: 'error',
        data: null,
        errors: errs,
      });
    }
  }
}
