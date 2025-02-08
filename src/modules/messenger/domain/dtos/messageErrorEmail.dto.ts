export class ErrorMessageEmailDto {
  constructor(data?: Partial<ErrorMessageEmailDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  receptor: string;
  errorMessage: string;
  errorCode: string;
  timestamp: string;
  errorLocation: string;
}
