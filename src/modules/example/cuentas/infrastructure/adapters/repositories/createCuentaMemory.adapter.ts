import { cuentaModel } from 'src/main';
import { ICreateCuentaRepository } from '../../../domain/ports/repositories';
import { CuentaEntity } from '../../../domain/entities';

export class CreateCuentaMemoryAdapter implements ICreateCuentaRepository {
  async create(cuenta: CuentaEntity): Promise<CuentaEntity> {
    cuentaModel.push({
      ...cuenta,
    } as CuentaEntity);

    return cuenta;
  }
} 
