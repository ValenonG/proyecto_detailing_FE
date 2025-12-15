import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clienteReducer from './slices/clienteSlice';
import vehiculoReducer from './slices/vehiculoSlice';
import trabajosReducer from './slices/trabajosSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cliente: clienteReducer,
    vehiculo: vehiculoReducer,
    trabajos: trabajosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
