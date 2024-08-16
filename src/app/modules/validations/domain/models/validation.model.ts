export interface IValidation<T> {
  validate(param: T): Promise<boolean>;
}