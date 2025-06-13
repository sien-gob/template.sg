import { ValidationError } from "class-validator";
import { ErrorData, IException } from "./error.model";

export class ValidatorException extends Error implements IException {
  constructor(public readonly errors: ValidationError[]) {
    super("Error de validación de datos de entrada");
    this.name = "ValidatorException";
  }
  
  getErrors(): ErrorData[] {
     const mappedErrors = this.errors.map((error) => {
       const constraintKey = Object.keys(error.constraints!)[0];
       return <ErrorData>{
         code: constraintKey,
         path: `/${error.property.toUpperCase()}`,
         message: error.constraints![constraintKey],
       };
     });
     return mappedErrors;
  }
}