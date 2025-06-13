import { Injectable } from '@nestjs/common';
import { BusinessValidator } from 'src/app/modules/businessRules/domain/validations';

import { BusinessRuleContext } from 'src/app/modules/businessRules/domain/models';
import { LoginRule } from './login.rule';
import { LoginValidationParam } from '../../infrastructure/adapters/services';

export interface LoginContext extends BusinessRuleContext {
  param: LoginValidationParam
}

@Injectable()
export class LoginBusinessValidator extends BusinessValidator<LoginContext> {
  constructor(private readonly loginRule: LoginRule) {
    super();
    this.initializeRules();
  }

  private initializeRules(): void {
    this.addRule(this.loginRule);
    // ...otras reglas
  }
}
