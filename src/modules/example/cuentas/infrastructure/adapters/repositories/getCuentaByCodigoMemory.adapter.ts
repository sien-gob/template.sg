import { Injectable } from '@nestjs/common';
import { cuentaModel } from 'src/main';
import { IGetCuentaByCodigoRepository } from '../../../domain/ports/repositories';
import { CuentaEntity } from '../../../domain/entities';

@Injectable()
export class GetCuentaByCodigoMemoryAdapter implements IGetCuentaByCodigoRepository {
  async getByCodigo(codigo: string): Promise<CuentaEntity> {
    const index = await cuentaModel.findIndex((cuenta) => cuenta.codigo === codigo); 

    if (index === -1) {
      throw new Error('No se encontro la cuenta con el codigo proporcionado');
    }

    return cuentaModel[index];
  }
}
