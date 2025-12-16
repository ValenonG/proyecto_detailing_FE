import api from './api';
import { personaService } from './personaService';
import type { Proveedor, CreateProveedorRequest, UpdateProveedorRequest } from '../types/proveedor.types';

export const proveedorService = {
    getAll: async (): Promise<Proveedor[]> => {
        const proveedores = await personaService.getByTipo('Proveedor');
        return proveedores as Proveedor[];
    },

    getById: async (id: string): Promise<Proveedor> => {
        const proveedor = await personaService.getById(id);
        if (proveedor.tipo !== 'Proveedor') {
            throw new Error('La persona solicitada no es un proveedor');
        }
        return proveedor as Proveedor;
    },

    create: async (proveedorData: CreateProveedorRequest): Promise<Proveedor> => {
        const response = await api.post('/persona/register', {
            ...proveedorData,
            tipo: 'Proveedor',
            password: 'defaultPassword123'
        });
        return response.data.persona; 
    },

    update: async (id: string, proveedorData: UpdateProveedorRequest): Promise<Proveedor> => {
        const response = await api.put(`/persona/${id}`, proveedorData);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await personaService.delete(id);
    },
};

export default proveedorService;