import { Inject, Injectable } from '@nestjs/common';
import { IAuthenticationServicePort } from '../../domain/ports/services';
import { JwtPayloadAccess } from '../../domain/payloads';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('IAuthenticationServicePort')
    private readonly authService: IAuthenticationServicePort,
  ) {}

  async run(token: string): Promise<JwtPayloadAccess> {
    return await this.authService.autentication(token);
  }
}
