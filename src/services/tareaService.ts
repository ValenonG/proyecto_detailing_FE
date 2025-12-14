import api from './api';

export interface Tarea {
  _id: string;
  descripcion: string;
  precio: number;
  tiempo_estimado: number;
  createdAt?: string;
  updatedAt?: string;
}

export const tareaService = {
  getAll: async (): Promise<Tarea[]> => {
    const response = await api.get('/tarea');
    return response.data;
  },

  getById: async (id: string): Promise<Tarea> => {
    const response = await api.get(`/tarea/${id}`);
    return response.data;
  },

  create: async (tarea: Omit<Tarea, '_id'>): Promise<Tarea> => {
    const response = await api.post('/tarea', tarea);
    return response.data;
  },

  update: async (id: string, tarea: Partial<Tarea>): Promise<Tarea> => {
    const response = await api.put(`/tarea/${id}`, tarea);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tarea/${id}`);
  },
};

export default tareaService;
