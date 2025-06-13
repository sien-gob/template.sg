import { ErrorData, Exception } from 'src/system/exceptions';
import { z } from 'zod';

export class RedisException extends Exception {
  constructor(params: Partial<ErrorData>);
  constructor(errors: z.ZodError);
  constructor(paramOrErrors: Partial<ErrorData> | z.ZodError) {
    if (paramOrErrors instanceof z.ZodError) {
      super(paramOrErrors);
    } else {
      super({
        code: `${paramOrErrors.code || '400'}-LAYOUT`,
        path: paramOrErrors.path || '/',
        message: paramOrErrors.message || 'Error en layout',
      });
    }
  }
}
