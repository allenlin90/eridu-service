import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsPrefixedUUID(
  prefix: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPrefixedUUID',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // validate uuid v4
          const regex = new RegExp(
            `^${prefix}_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`,
          );
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `Value must be a UUID with the prefix '${prefix}'.`;
        },
      },
    });
  };
}
