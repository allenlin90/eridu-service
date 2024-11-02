import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsPrefixedNanoID(
  prefix: string,
  size = 21,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPrefixedNanoID',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const regex = new RegExp(`^${prefix}_[0-9a-zA-Z-_]{${size}}$`);
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `Value must be a NanoID with the prefix '${prefix}' and length of ${size}.`;
        },
      },
    });
  };
}
