import type { User } from './auth.types';

export interface Proveedor extends Omit<User, 'tipo'> {
    tipo: 'Proveedor';
}

export interface CreateProveedorRequest {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono?: string;
    direccion?: string;
    cuit?: string;
}

export interface UpdateProveedorRequest {
    nombre?: string;
    apellido?: string;
    dni?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    cuit?: string;
}