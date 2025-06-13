import { ErrorData, ErrorProcessor } from 'src/system/exceptions';
import { ProcessType, RestResponse } from './rest.response';
import axios from 'axios';
import { ModuleRef } from '@nestjs/core';

export class ApiResponse {
  private static moduleRef: ModuleRef;

  static setModuleRef(moduleRef: ModuleRef) {
    this.moduleRef = moduleRef;
  }

  static async processRequest<D>(process: ProcessType<D>): Promise<RestResponse<D>> {
    try {
      const result = await process();
      const response: RestResponse<D> = {
        status: 'success',
        data: result as D,
        errors: null,
      };
      return response;
    } catch (error) {
      let errs = ApiResponse.handleAxiosError(error);
      if (!errs) errs = ErrorProcessor.processError(error);

      // if (this.moduleRef) {
      //   const syslogService = this.moduleRef.get(SyslogSaveService, { strict: false });
      //   await syslogService.run({
      //     level: 'ERROR',
      //     source: 'API_RESPONSE',
      //     metadata: JSON.stringify(errs),
      //     message: 'Error en proceso de la petición',
      //   });
      // }

      return {
        status: 'error',
        data: null,
        errors: errs,
      };
    }
  }

  private static handleAxiosError(error: any): ErrorData[] | undefined {
    const errs: ErrorData[] = [];

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        // 🔴 Error de timeout
        errs.push({
          code: '408',
          path: '/',
          message: 'Timeout: El servidor tardó demasiado en responder. Verifique su conexión o el estado del servidor.',
        });
      } else if (error.response) {
        // 🔵 Error con respuesta del servidor
        errs.push({
          code: error.response.status?.toString(),
          path: '/',
          message: 'Error desconocido en la respuesta del servidor',
        });
      } else if (error.request) {
        // 🟡 No hubo respuesta del servidor
        errs.push({
          code: '400',
          path: '/',
          message: 'La solicitud fue hecha, pero no se recibió respuesta. Puede haber problemas de red o el servidor no está disponible.',
        });
      } else {
        // 🟠 Otros errores de Axios
        console.log('api.response :: ', error.message);
        errs.push({ code: '400', path: '/', message: error.message });
      }

      return errs;
    } else {
      return undefined;
    }
  }
}
