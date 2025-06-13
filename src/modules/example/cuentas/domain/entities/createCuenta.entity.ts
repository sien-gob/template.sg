export class CreateCuentaEntity {
  constructor(data?: Partial<CreateCuentaEntity>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
}
