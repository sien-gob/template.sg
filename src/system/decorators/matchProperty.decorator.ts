import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function MatchProperty(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'matchProperty',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          return `${propertyName} y ${validationArguments?.constraints[0]} no son iguales`;
        },
      },
    });
  };
}
