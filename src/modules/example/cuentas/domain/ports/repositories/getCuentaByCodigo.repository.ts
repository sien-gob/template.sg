import { CuentaEntity } from "../../entities";

export interface IGetCuentaByCodigoRepository {
  getByCodigo: (codigo: string) => Promise<CuentaEntity>;  
}