import { IValidation } from '../../domain/models';

export class ValidatorService<T> {
  constructor(private readonly validators: IValidation<T>[]) {
    this.validators = validators;
  }

  async validate(param: T): Promise<void> {
    for (const validator of this.validators) {
      await validator.validate(param);
    }
  }
}
