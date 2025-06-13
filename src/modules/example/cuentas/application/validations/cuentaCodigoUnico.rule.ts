import { Injectable } from '@nestjs/common';
import { BusinessRule, ErrorResult } from 'src/app/modules/businessRules/domain/models';
import { CuentaContext } from './cuentaBusiness.validator';

@Injectable()
export class CuentaCodigoUnicoRule implements BusinessRule<CuentaContext> {
  constructor() {}

  isValid(context: CuentaContext, onError?: (e: ErrorResult) => void): Promise<boolean> | boolean {
    if (context.codigo === 'X-CODE') {
      if (onError) onError({ ruleName: this.getName(), message: this.getErrorMessage() });

      return false;
    }

    return true;
  }

  getErrorMessage(): string {
    return 'El codigo de la cuenta debe ser única por subdominio';
  }

  getName(): string {
    return 'CuentaCodigoUnicoRule';
  }
}
