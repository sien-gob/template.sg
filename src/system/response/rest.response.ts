import { ErrorData } from 'src/system/exceptions';

export type Status = 'success' | 'error';

export class RestResponse<D> {
  status: Status;
  data: D | null;
  errors: ErrorData[] | null;
}

export type ProcessType<T> = () => Promise<T | null>;
