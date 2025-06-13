import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { envs } from 'src/system/configs';
import { CredentialDto, LoginDto } from '../../../domain/dtos';
import { ILoginServicePort } from '../../../domain/ports/services';
import { IGetUserByNameRepository } from '../../../domain/ports/repositories';

import { UserEntity } from '../../../domain/entities';
import { JwtPayloadAccess } from '../../../domain/payloads';
import { SyslogSaveService } from 'src/app/modules/syslogs/application/services';
import { LoginBusinessValidator, LoginContext } from '../../../application/validations';

export type LoginValidationParam = [CredentialDto, UserEntity?];

@Injectable()
export class LoginLocalServiceAdapter implements ILoginServicePort {
  constructor(
    @Inject('IGetUserByNameRepository')
    private readonly getUser: IGetUserByNameRepository,

    private readonly loginValidator: LoginBusinessValidator,

    private jwtService: JwtService,
    private readonly syslogSaveService: SyslogSaveService,
  ) {}

  async login(credential: CredentialDto): Promise<LoginDto> {
    const user = await this.getUser.getUserByName(credential);

    if (envs.system.test_syslog) {
      await this.syslogSaveService.run({
        level: 'INFO',
        source: 'INFRASTRUCTURE_ADAPTER_SERVICE',
        message: `Se guardo el log`,
      });
    }

    await this.validate(credential, user);

    const payload: JwtPayloadAccess = {
      access: {
        scope: user?.scope!,
        user: {
          userId: user?.userId!,
          username: user?.name!,
          roles: user?.roles,
        },
        apikey: '',
      },
    };

    const accessToken = this.jwtService.sign({ ...payload }, { secret: envs.keys.jwt, expiresIn: envs.keys.jwt_access_expires_in });
    const refreshToken = this.jwtService.sign({ ...payload }, { secret: envs.keys.jwt_refresh, expiresIn: envs.keys.jwt_refresh_expires_in });

    return {
      userId: user?.userId!,
      username: user?.name!,
      token: accessToken,
      refreshToken,
    };
  }

  private async validate(credential: CredentialDto, user?: UserEntity): Promise<void> {
    const context: LoginContext = {
      param: [credential, user],
    };

    await this.loginValidator.validateFast(context);
  }
}
