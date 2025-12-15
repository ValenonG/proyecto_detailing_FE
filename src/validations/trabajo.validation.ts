import Joi from 'joi';

// Esquema para crear un trabajo
export const createTrabajoSchema = Joi.object({
    vehiculo: Joi.string().required().messages({
        'string.empty': 'El vehículo es requerido',
        'any.required': 'El vehículo es requerido',
    }),
    tareas: Joi.array()
        .items(
            Joi.object({
                tarea_id: Joi.string().required(),
                precio_al_momento: Joi.number().min(0).required(),
            })
        )
        .min(1)
        .required()
        .messages({
            'array.min': 'Debe seleccionar al menos una tarea',
            'any.required': 'Las tareas son requeridas',
        }),
    productos_usados: Joi.array()
        .items(
            Joi.object({
                producto_id: Joi.string().required(),
                cantidad: Joi.number().min(1).required().messages({
                    'number.min': 'La cantidad debe ser al menos 1',
                }),
            })
        )
        .default([]),
    observaciones: Joi.string().allow('', null).optional(),
    precio_total: Joi.number().min(0).required(),
});

// Esquema para actualizar un trabajo
export const updateTrabajoSchema = Joi.object({
    vehiculo: Joi.string().optional(),
    estado: Joi.string()
        .valid('Pendiente', 'En Proceso', 'Terminado', 'Entregado')
        .optional(),
    tareas: Joi.array()
        .items(
            Joi.object({
                tarea_id: Joi.string().required(),
                precio_al_momento: Joi.number().min(0).required(),
            })
        )
        .optional(),
    productos_usados: Joi.array()
        .items(
            Joi.object({
                producto_id: Joi.string().required(),
                cantidad: Joi.number().min(1).required(),
            })
        )
        .optional(),
    observaciones: Joi.string().allow('', null).optional(),
    precio_total: Joi.number().min(0).optional(),
});
