import { Inject, Injectable } from '@nestjs/common';
import { CuentaDto } from '../../domain/dtos';
import { UpdateCuentaEntity } from '../../domain/entities';
import { CuentaEntityToCuentaDtoMapper } from '../../domain/mappers';
import { IUpdateCuentaRepository } from '../../domain/ports/repositories';

@Injectable()
export class UpdateCuentaService {
  constructor(
    @Inject('IUpdateCuentaRepository')
    private readonly updateRepository: IUpdateCuentaRepository,
  ) {}

  async run(codigo: string, data: UpdateCuentaEntity): Promise<CuentaDto> {
    const cuentaEntity = await this.updateRepository.update(codigo, data);
    return CuentaEntityToCuentaDtoMapper.mapping(cuentaEntity);
  }
}
