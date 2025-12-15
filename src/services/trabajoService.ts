import api from './api';

export interface Vehiculo {
  _id: string;
  marca: string;
  modelo: string;
  patente?: string;
  cliente?: {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
}

export interface TareaInfo {
  _id: string;
  descripcion: string;
  precio: number;
  tiempo_estimado: number;
}

export interface ProductoInfo {
  _id: string;
  nombre: string;
  precio_venta: number;
  stock_actual: number;
}

export interface Trabajo {
  _id: string;
  vehiculo: string | Vehiculo;
  estado: 'Pendiente' | 'En Proceso' | 'Terminado' | 'Entregado';
  tareas: Array<{
    tarea: string | TareaInfo;
    precio_al_momento: number;
  }>;
  productos_usados: Array<{
    producto: string | ProductoInfo;
    cantidad: number;
  }>;
  observaciones?: string;
  precio_total: number;
  createdAt?: string;
  updatedAt?: string;
}

export const trabajoService = {
  getAll: async (): Promise<Trabajo[]> => {
    const response = await api.get('/trabajo');
    return response.data.data || response.data;
  },

  getById: async (id: string): Promise<Trabajo> => {
    const response = await api.get(`/trabajo/${id}`);
    return response.data;
  },

  getByEstado: async (estado: string): Promise<Trabajo[]> => {
    const response = await api.get(`/trabajo/estado/${estado}`);
    return response.data;
  },

  create: async (trabajo: Omit<Trabajo, '_id'>): Promise<Trabajo> => {
    const response = await api.post('/trabajo', trabajo);
    return response.data;
  },

  update: async (id: string, trabajo: Partial<Trabajo>): Promise<Trabajo> => {
    const response = await api.patch(`/trabajo/${id}`, trabajo);
    return response.data;
  },

  hardDelete: async (id: string): Promise<void> => {
    await api.delete(`/trabajo/hard/${id}`);
  },

  softDelete: async (id: string): Promise<void> => {
    await api.patch(`/trabajo/soft/${id}`);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/trabajo/hard/${id}`);
  },
};

export default trabajoService;
