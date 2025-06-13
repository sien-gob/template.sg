export class UpdateCuentaEntity {
  constructor(data?: Partial<UpdateCuentaEntity>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  nombre: string;
  descripcion: string;
}
