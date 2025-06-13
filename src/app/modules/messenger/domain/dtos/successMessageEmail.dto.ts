export class SuccessMessageEmailDto {
  constructor(data?: Partial<SuccessMessageEmailDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  origin: string;
  receptor: string;
  title: string;
  message: string;
  details: string;
  timestamp: string;
}
