import api from './api';

export interface Persona {
  _id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono?: string;
  direccion?: string;
  cuit?: string;
  tipo: 'Cliente' | 'Empleado' | 'Administrador' | 'Proveedor';
  firebaseUid: string;
  createdAt?: string;
  updatedAt?: string;
}

export const personaService = {
  getAll: async (): Promise<Persona[]> => {
    const response = await api.get('/persona');
    return response.data;
  },

  getById: async (id: string): Promise<Persona> => {
    const response = await api.get(`/persona/${id}`);
    return response.data;
  },

  getByTipo: async (tipo: string): Promise<Persona[]> => {
    const response = await api.get(`/persona/tipo/${tipo}`);
    return response.data;
  },

  update: async (id: string, persona: Partial<Persona>): Promise<Persona> => {
    const response = await api.put(`/persona/${id}`, persona);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/persona/${id}`);
  },
};

export default personaService;
