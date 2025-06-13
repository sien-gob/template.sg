export type CurrentVersion = {
  codigo: string;
  nombre: string;
  valor: any;
  descripcion: string;
};

export interface IGetCurrentVersionRepository {
  getVersion(): Promise<CurrentVersion[]>;
}