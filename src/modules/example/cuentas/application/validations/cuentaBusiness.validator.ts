import { Injectable } from '@nestjs/common';
import { BusinessValidator } from 'src/app/modules/businessRules/domain/validations';

import { BusinessRuleContext } from 'src/app/modules/businessRules/domain/models';
import { CuentaCodigoUnicoRule } from './cuentaCodigoUnico.rule';
import { CuentaNombreLargoRule } from './cuentaNombreLargo.rule';
import { CuentaUltimoNivelRule } from './cuentaUltimoNivel.rule';

export interface CuentaContext extends BusinessRuleContext {
  codigo?: string;
  nombre?: string;
}

@Injectable()
export class CuentaBusinessValidator extends BusinessValidator<CuentaContext> {
  constructor(
    private readonly codeUniqueRule: CuentaCodigoUnicoRule,
    private readonly nameLengthRule: CuentaNombreLargoRule,
    private readonly lastLevelRule: CuentaUltimoNivelRule,
  ) {
    super();
    this.initializeRules();
  }

  private initializeRules(): void {
    this.addRule(this.codeUniqueRule);
    this.addRule(this.nameLengthRule);
    this.addRule(this.lastLevelRule);
    // ...otras reglas
  }
}
