import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetCuentaByCodigoService } from '../../application/services';
import { CuentaDto } from '../../domain/dtos';
import { ProcessRequest } from 'src/system/response/decorators';
import { CuentaResponse } from '../../domain/responses';
import { GetCuentaByCodigoInput } from '../../domain/args';

@Resolver()
export class GetCuentaByCodigoResolver {
  constructor(private readonly getCuentaByCodigoService: GetCuentaByCodigoService) {}

  @Query(() => CuentaResponse, { name: 'getCuentaByCodigo' })
  @ProcessRequest<CuentaDto>()
  async getClassifiers(@Args('inputs') inputs: GetCuentaByCodigoInput): Promise<CuentaDto> {
    return await this.getCuentaByCodigoService.run(inputs.codigo);
  }
}
