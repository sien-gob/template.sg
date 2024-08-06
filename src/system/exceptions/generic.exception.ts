import { ErrorData, IException } from "./error.model";

export class Exception extends Error implements IException {
  constructor(public readonly params: ErrorData) {
    super(params.message);
    this.name = "Exception";
  }

  getErrors(): ErrorData[] {
    return [{ ...this.params }];
  }
}
