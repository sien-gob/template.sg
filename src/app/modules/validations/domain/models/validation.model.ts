export type ValidateResponse<R = any> = {
  isValid: boolean;
  errors?: string[];
  data?: R;
};

export interface IValidation<P, R = any> {
  validate(param: P): Promise<ValidateResponse<R>>;
}
