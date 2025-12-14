import api from './api';
import type { Vehiculo, CreateVehiculoRequest, UpdateVehiculoRequest } from '../types/vehiculo.types';

export const vehiculoService = {
    getAll: async (): Promise<Vehiculo[]> => {
        const response = await api.get('/vehiculo/all');
        return response.data.data || response.data;
    },

    getById: async (id: string): Promise<Vehiculo> => {
        const response = await api.get(`/vehiculo/${id}`);
        return response.data;
    },

    create: async (vehiculoData: CreateVehiculoRequest): Promise<Vehiculo> => {
        const response = await api.post('/vehiculo', vehiculoData);
        return response.data;
    },

    update: async (id: string, vehiculoData: UpdateVehiculoRequest): Promise<Vehiculo> => {
        const response = await api.patch(`/vehiculo/${id}`, vehiculoData);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/vehiculo/hard/${id}`);
    },
};

export default vehiculoService;
