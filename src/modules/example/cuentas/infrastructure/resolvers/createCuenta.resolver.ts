import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCuentaService } from '../../application/services';
import { CreateCuentaDto, CuentaDto } from '../../domain/dtos';
import { ProcessRequest } from 'src/system/response/decorators';
import { CuentaResponse } from '../../domain/responses';
import { UseGuards } from '@nestjs/common';
import { AuthenticationGuard, AuthorizationGuard } from 'src/app/modules/access/infrastructure/guards';
import { CuentaActions, CuentaResources } from '../../domain/access';
import { Permissions } from 'src/app/modules/access/infrastructure/decorators';
import { RequestContext } from 'src/app/modules/shared/models';
import { RequestContextService } from 'src/app/modules/requests/services';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Resolver()
export class CreateCuentaResolver {
  constructor(
    private readonly createCuentaService: CreateCuentaService,
    private readonly requestContext: RequestContextService,
  ) {}

  @Permissions([{ resource: CuentaResources.cuenta, actions: { api: [CuentaActions.api.create, CuentaActions.api.all] } }])
  @Mutation(() => CuentaResponse, { name: 'createCuenta' })
  @ProcessRequest<CuentaDto>()
  async create(@Args('inputs') inputs: CreateCuentaDto, @Context() context: any): Promise<CuentaDto> {
    // const ctx: RequestContext | undefined = context?.context;
    // console.log('createCuenta.resolver :: ', ctx);

    const requestId = this.requestContext.getRequestId();
    console.log('createCuenta.resolver :: ', requestId);
    const access = this.requestContext.getAccess();
    console.log('createCuenta.resolver :: ', access);

    return await this.createCuentaService.run(inputs);
  }
}
