import { ErrorData, IException } from 'src/system/exceptions';

export class NestValidationPipeException extends Error implements IException {
  constructor(
    public readonly errors: string[],
    private readonly code?: string,
  ) {
    super('Error de validación de datos de entrada');
    this.name = 'NestValidatorException';
  }

  getErrors(): ErrorData[] {
    const mappedErrors = this.errors.map((error) => {
      return <ErrorData>{
        code: this.code ? this.code : '400',
        path: `/input`,
        message: error,
      };
    });
    return mappedErrors;
  }
}
