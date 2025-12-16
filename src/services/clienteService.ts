import api from './api';
import { personaService } from './personaService';
import type { Cliente, CreateClienteRequest, UpdateClienteRequest } from '../types/cliente.types';

export const clienteService = {
    getAll: async (): Promise<Cliente[]> => {
        const clientes = await personaService.getByTipo('Cliente');
        return clientes as Cliente[];
    },

    getById: async (id: string): Promise<Cliente> => {
        const cliente = await personaService.getById(id);
        if (cliente.tipo !== 'Cliente') {
            throw new Error('La persona solicitada no es un cliente');
        }
        return cliente as Cliente;
    },

    create: async (clienteData: CreateClienteRequest): Promise<Cliente> => {
        const response = await api.post('/persona/register', {
            ...clienteData,
            tipo: 'Cliente',
            password: 'defaultPassword123'
        });
        return response.data.persona;
    },

    update: async (id: string, clienteData: UpdateClienteRequest): Promise<Cliente> => {
        const response = await api.put(`/persona/${id}`, clienteData);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await personaService.delete(id);
    },
};

export default clienteService;
