import { Inject, Injectable } from '@nestjs/common';
import { CuentaDto } from '../../domain/dtos';
import { CuentaEntityToCuentaDtoMapper } from '../../domain/mappers';
import { IGetCuentaByCodigoRepository } from '../../domain/ports/repositories';

@Injectable()
export class GetCuentaByCodigoService {
  constructor(
    @Inject('IGetCuentaByCodigoRepository')
    private readonly getRepository: IGetCuentaByCodigoRepository,
  ) {}

  async run(data: string): Promise<CuentaDto> {
    const cuentaEntity = await this.getRepository.getByCodigo(data);
    return CuentaEntityToCuentaDtoMapper.mapping(cuentaEntity);
  }
}
