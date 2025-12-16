import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clienteReducer from './slices/clienteSlice';
import vehiculoReducer from './slices/vehiculoSlice';
import trabajosReducer from './slices/trabajosSlice';
import productosReducer from './slices/productosSlice';
import proveedorReducer from './slices/proveedorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cliente: clienteReducer,
    vehiculo: vehiculoReducer,
    trabajos: trabajosReducer,
    productos: productosReducer,
    proveedor: proveedorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
