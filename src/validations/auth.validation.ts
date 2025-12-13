import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'El email es requerido',
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'La contraseña es requerida',
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La contraseña es requerida',
    }),
});

export const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'El email es requerido',
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'La contraseña es requerida',
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La contraseña es requerida',
    }),
  nombre: Joi.string()
    .min(2)
    .required()
    .messages({
      'string.empty': 'El nombre es requerido',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'any.required': 'El nombre es requerido',
    }),
  apellido: Joi.string()
    .min(2)
    .required()
    .messages({
      'string.empty': 'El apellido es requerido',
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'any.required': 'El apellido es requerido',
    }),
  dni: Joi.string()
    .pattern(/^[0-9]{7,8}$/)
    .required()
    .messages({
      'string.empty': 'El DNI es requerido',
      'string.pattern.base': 'El DNI debe tener 7 u 8 dígitos',
      'any.required': 'El DNI es requerido',
    }),
  telefono: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'El teléfono debe tener entre 10 y 15 dígitos',
    }),
  direccion: Joi.string()
    .optional()
    .allow(''),
  cuit: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'El CUIT debe tener 11 dígitos',
    }),
  tipo: Joi.string()
    .valid('Cliente', 'Empleado', 'Administrador', 'Proveedor')
    .optional(),
});
