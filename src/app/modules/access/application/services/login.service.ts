import { Inject, Injectable } from '@nestjs/common';
import { CredentialDto, LoginDto } from '../../domain/dtos';
import { ILoginServicePort } from '../../domain/ports/services';
import { SyslogSaveService } from 'src/app/modules/syslogs/application/services';
import { envs } from 'src/system/configs';

@Injectable()
export class LoginService {
  constructor(
    @Inject('ILoginServicePort')
    private readonly loginService: ILoginServicePort,

    private readonly syslogSaveService: SyslogSaveService,
  ) {}

  async run(credential: CredentialDto): Promise<LoginDto> {

    if(envs.system.test_syslog) {
      await this.syslogSaveService.run({
        level: 'INFO',
        source: 'APPLICATION_SERVICES',
        message: `Se hizo un login con ${credential.username}`,
      });
    }

    return await this.loginService.login(credential);
  }
}
