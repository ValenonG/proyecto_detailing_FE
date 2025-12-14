import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Cliente } from '../../types/cliente.types';

interface ClienteState {
    clientes: Cliente[];
    selectedCliente: Cliente | null;
    loading: boolean;
    error: string | null;
}

const initialState: ClienteState = {
    clientes: [],
    selectedCliente: null,
    loading: false,
    error: null,
};

const clienteSlice = createSlice({
    name: 'cliente',
    initialState,
    reducers: {
        fetchStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchSuccess: (state, action: PayloadAction<Cliente[]>) => {
            state.loading = false;
            state.clientes = action.payload;
            state.error = null;
        },
        fetchFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        setSelectedCliente: (state, action: PayloadAction<Cliente | null>) => {
            state.selectedCliente = action.payload;
        },
        addCliente: (state, action: PayloadAction<Cliente>) => {
            state.clientes.push(action.payload);
        },
        updateCliente: (state, action: PayloadAction<Cliente>) => {
            const index = state.clientes.findIndex(c => c._id === action.payload._id);
            if (index !== -1) {
                state.clientes[index] = action.payload;
            }
        },
        removeCliente: (state, action: PayloadAction<string>) => {
            state.clientes = state.clientes.filter(c => c._id !== action.payload);
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    fetchStart,
    fetchSuccess,
    fetchFailure,
    setSelectedCliente,
    addCliente,
    updateCliente,
    removeCliente,
    clearError,
} = clienteSlice.actions;

export default clienteSlice.reducer;
