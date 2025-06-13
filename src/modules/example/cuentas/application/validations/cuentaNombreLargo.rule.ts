import { Injectable } from '@nestjs/common';
import { BusinessRule, ErrorResult } from 'src/app/modules/businessRules/domain/models';
import { CuentaContext } from './cuentaBusiness.validator';


@Injectable()
export class CuentaNombreLargoRule implements BusinessRule<CuentaContext> {
  constructor() {}

  isValid(context: CuentaContext, onError?: (e: ErrorResult) => void): Promise<boolean> | boolean {
    if (!context.nombre) {
      return true;
    }

    if (context.nombre?.length > 6) {
      if (onError) onError({ ruleName: this.getName(), message: this.getErrorMessage() });
      return false;
    }

    return true;
  }

  getErrorMessage(): string {
    return 'El nombre de la cuenta no debe tener mas de 6 caracteres';
  }

  getName(): string {
    return 'CuentaNombreLargoRule';
  }
}
