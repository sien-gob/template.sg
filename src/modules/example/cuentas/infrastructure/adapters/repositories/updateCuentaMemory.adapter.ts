import { Injectable } from '@nestjs/common';
import { cuentaModel } from 'src/main';
import { IUpdateCuentaRepository } from '../../../domain/ports/repositories';
import { CuentaEntity, UpdateCuentaEntity } from '../../../domain/entities';

@Injectable()
export class UpdateCuentaMemoryAdapter implements IUpdateCuentaRepository {
  async update(codigo: string, data: UpdateCuentaEntity): Promise<CuentaEntity> {
    const index = await cuentaModel.findIndex((cuenta) => cuenta.codigo === codigo);

    cuentaModel[index].nombre = data.nombre;
    cuentaModel[index].descripcion = data.descripcion;
    return cuentaModel[index];
  }
}
