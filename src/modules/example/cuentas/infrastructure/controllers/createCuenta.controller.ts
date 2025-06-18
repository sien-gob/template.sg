import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateCuentaService } from '../../application/services';
import { ProcessRequest } from 'src/system/response/decorators';
import { CreateCuentaDto, CuentaDto } from '../../domain/dtos';
import { Permissions } from 'src/app/modules/access/infrastructure/decorators';
import { CuentaActions, CuentaResources } from '../../domain/access';
import { AuthenticationGuard, AuthorizationGuard } from 'src/app/modules/access/infrastructure/guards';
import { RequestContextService } from 'src/app/modules/requests/services';
import { JwtPayloadAccess } from 'src/app/modules/access/domain/payloads';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('cuentas')
export class CreateCuentaController {
  constructor(
    private readonly createService: CreateCuentaService,
    private readonly requestContext: RequestContextService,
  ) {}

  @Permissions([{ resource: CuentaResources.cuenta, actions: { api: [CuentaActions.api.create, CuentaActions.api.all] } }])
  @Post('create')
  @ProcessRequest<CuentaDto>()
  async create(@Body() input: CreateCuentaDto): Promise<CuentaDto> {
    const requestId = this.requestContext.getRequestId();
    //console.log('createCuenta.controller :: ', requestId);

    const access: JwtPayloadAccess | undefined = this.requestContext.getAccess();
    //console.log('createCuenta.controller :: ', access);

    return await this.createService.run(input);
  }
}
