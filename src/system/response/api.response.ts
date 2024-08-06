import { ErrorProcessor } from 'src/system/exceptions';
import { ProcessType, RestResponse } from './rest.response';

export class ApiResponse {
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
      const errs = ErrorProcessor.processError(error);
      return {
        status: 'error',
        data: null,
        errors: errs,
      };
    }
  }
}
