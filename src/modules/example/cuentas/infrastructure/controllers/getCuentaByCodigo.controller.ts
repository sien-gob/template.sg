import { Controller, Get, Param } from '@nestjs/common';
import { GetCuentaByCodigoService } from '../../application/services';
import { ProcessRequest } from 'src/system/response/decorators';
import { CuentaDto } from '../../domain/dtos';

@Controller('cuentas')
export class GetCuentaByCodigoController {
  constructor(private readonly getCuentaByCodigoService: GetCuentaByCodigoService) {}

  @Get('getByCodigo/:codigo')
  @ProcessRequest<CuentaDto>()
  async getCuentaByCodigo(@Param('codigo') codigo: string): Promise<CuentaDto> {
    return await this.getCuentaByCodigoService.run(codigo);
  }
}
