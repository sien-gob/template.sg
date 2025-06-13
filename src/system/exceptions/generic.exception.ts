import { ErrorData, IException } from './error.model';
import { z } from 'zod';

export class Exception extends Error implements IException {
  public readonly params: ErrorData[];

  constructor(params: ErrorData);
  constructor(params: ErrorData[]);
  constructor(errors: z.ZodError);
  constructor(paramOrErrors: ErrorData | ErrorData[] | z.ZodError) {
    if (paramOrErrors instanceof z.ZodError) {
      super('Error en propiedades');
      this.params = this.zodMapper(paramOrErrors);
    } else if (Array.isArray(paramOrErrors)) {
      // Manejar caso de array de ErrorData
      super('Múltiples errores');
      this.params = [...paramOrErrors];
    } else {
      // Manejar caso de un solo ErrorData
      super(paramOrErrors.message);
      this.params = [paramOrErrors];
    }
    this.name = 'Exception';
  }

  getErrors(): ErrorData[] {
    return this.params;
  }

  private zodMapper(errors: z.ZodError): ErrorData[] {
    return errors.errors.map((error) => {
      const { path, expected, received } = error as any;
      let customMessage = '';

      if (received === 'undefined') {
        customMessage = `El parámetro ${path.join('.')} es requerido`;
      } else if (expected !== received) {
        customMessage = `El parámetro ${path.join('.')} tiene un valor incorrecto, se esperaba: ${expected} y se recibe: ${received}`;
      }

      return {
        code: error.code,
        path: '/Parámetro',
        message: customMessage,
      };
    });
  }
}
