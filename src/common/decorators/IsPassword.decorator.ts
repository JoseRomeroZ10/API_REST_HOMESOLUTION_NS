import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          return (
            value.length >= 8 &&
            /[A-Z]/.test(value) &&
            /[a-z]/.test(value) &&
            /\d/.test(value)
          );
        },
        defaultMessage(args: ValidationArguments) {
          const value = args.value;

          if (typeof value !== 'string') {
            return 'La contraseña debe ser un texto válido';
          }

          const errores: string[] = [];
          if (value.length < 8) errores.push('mínimo 8 caracteres');
          if (!/[A-Z]/.test(value)) errores.push('una mayúscula');
          if (!/[a-z]/.test(value)) errores.push('una minúscula');
          if (!/\d/.test(value)) errores.push('un número');
          if (!/[\W_]/.test(value)) errores.push('un símbolo');

          return `Contraseña inválida, falta: ${errores.join(', ')}`;
        },
      },
    });
  };
}
