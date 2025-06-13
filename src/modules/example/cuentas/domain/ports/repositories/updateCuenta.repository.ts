import { CuentaEntity, UpdateCuentaEntity } from "../../entities";

export interface IUpdateCuentaRepository {
  update: (codigo: string, data: UpdateCuentaEntity) => Promise<CuentaEntity>;  
}