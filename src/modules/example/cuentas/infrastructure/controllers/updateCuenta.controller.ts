import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { UpdateCuentaService } from '../../application/services';
import { ProcessRequest } from 'src/system/response/decorators';
import { CreateCuentaDto, CuentaDto, UpdateCuentaDto } from '../../domain/dtos';

@Controller('cuentas')
export class UpdateCuentaController {
  constructor(private readonly createService: UpdateCuentaService) {}

  @Post('create/:codigo')
  @ProcessRequest<CuentaDto>()
  async update(@Param('codigo') codigo: string, @Body() input: UpdateCuentaDto): Promise<CuentaDto> {
    return await this.createService.run(codigo, input);
  }
}
