import type { User } from './auth.types';

export interface Cliente extends Omit<User, 'tipo'> {
    tipo: 'Cliente';
}

export interface CreateClienteRequest {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono?: string;
    direccion?: string;
    cuit?: string;
}

export interface UpdateClienteRequest {
    nombre?: string;
    apellido?: string;
    dni?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    cuit?: string;
}
