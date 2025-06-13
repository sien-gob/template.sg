import { IMapper } from 'src/app/modules/mappers/domain/models';
import { CuentaDto } from '../dtos';
import { CuentaEntity } from '../entities';

export class CuentaEntityToCuentaDtoMapper implements IMapper<CuentaEntity, CuentaDto> {
  private async map(input: CuentaEntity): Promise<CuentaDto> {
    return new CuentaDto({
      id: input.id,
      codigo: input.codigo,
      nombre: input.nombre,
      descripcion: input.descripcion,
    });
  }

  async mapping(input: CuentaEntity): Promise<CuentaDto> {
    return await this.map(input);
  }

  static async mapping(input: CuentaEntity): Promise<CuentaDto> {
    return await new CuentaEntityToCuentaDtoMapper().map(input);
  }
}
