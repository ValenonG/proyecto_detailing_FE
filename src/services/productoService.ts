import api from './api';

export interface Producto {
  _id: string;
  nombre: string;
  proveedor: string | any;
  precio_venta: number;
  stock_actual: number;
  stock_minimo: number;
  createdAt?: string;
  updatedAt?: string;
}

export const productoService = {
  getAll: async (): Promise<Producto[]> => {
    const response = await api.get('/producto');
    return response.data.data || response.data;
  },

  getById: async (id: string): Promise<Producto> => {
    const response = await api.get(`/producto/${id}`);
    return response.data;
  },

  getLowStock: async (): Promise<Producto[]> => {
    const response = await api.get('/producto/low-stock');
    return response.data;
  },

  create: async (producto: Omit<Producto, '_id'>): Promise<Producto> => {
    const response = await api.post('/producto', producto);
    return response.data;
  },

  update: async (id: string, producto: Partial<Producto>): Promise<Producto> => {
    const response = await api.put(`/producto/${id}`, producto);
    return response.data;
  },

  hardDelete: async (id: string): Promise<void> => {
    await api.delete(`/producto/hard/${id}`);
  },

  softDelete: async (id: string): Promise<void> => {
    await api.patch(`/producto/soft/${id}`);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/producto/hard/${id}`);
  },
};

export default productoService;
