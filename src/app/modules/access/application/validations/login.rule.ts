import { Injectable } from '@nestjs/common';
import { BusinessRule, ErrorResult } from 'src/app/modules/businessRules/domain/models';
import { LoginContext } from './loginBusiness.validator';
import { AuthException } from '../../domain/exceptions';

@Injectable()
export class LoginRule implements BusinessRule<LoginContext> {
  constructor() {}

  isValid(context: LoginContext, onError?: (e: ErrorResult) => void): Promise<boolean> | boolean {
    const [credential, user] = context.param;


    if (!credential || !credential.username || !credential.password) {
      if (onError) onError({ ruleName: this.getName(), message: this.getErrorMessage() });
      //throw new AuthException({ code: 'CREDENTIAL_NOT_PROVIDED', path: 'AUTH', message: 'El usuario y password son requeridos' });
      return false;
    }

    if (!user) {
      //throw new AuthException({ code: 'CREDENTIAL_NOT_VALID', path: 'AUTH', message: 'El usuario o password son incorrectos' });
      return false;
    }

    return true;
  }

  getErrorMessage(): string {
    return 'Credencial invalida';
  }

  getName(): string {
    return 'LoginRule';
  }
}
