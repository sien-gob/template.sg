export class CuentaEntity {
  constructor(data?: Partial<CuentaEntity>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  id: string;
  codigo: string;
  nombre:string;
  descripcion:string;
}
