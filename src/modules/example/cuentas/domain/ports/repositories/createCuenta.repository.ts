import { CreateCuentaEntity, CuentaEntity } from "../../entities";

export interface ICreateCuentaRepository {
  create: (data: CreateCuentaEntity) => Promise<CuentaEntity>;  
}