export interface IPermission {
  resource: string; // recurso al que aplica
  actions: {
    api?: string[] //aplica solo para el backend en los endpoinds que corresponsa
    module?: string[] //aplica solo para frontend en las interfaces que corresponda
  }
}
