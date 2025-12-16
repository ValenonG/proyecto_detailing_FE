// src/store/slices/proveedorSlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Proveedor } from '../../types/proveedor.types';

interface ProveedorState {
    proveedores: Proveedor[];
    selectedProveedor: Proveedor | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProveedorState = {
    proveedores: [],
    selectedProveedor: null,
    loading: false,
    error: null,
};

const proveedorSlice = createSlice({
    name: 'proveedor',
    initialState,
    reducers: {
        fetchStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchSuccess: (state, action: PayloadAction<Proveedor[]>) => {
            state.loading = false;
            state.proveedores = action.payload;
            state.error = null;
        },
        fetchFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        setSelectedProveedor: (state, action: PayloadAction<Proveedor | null>) => {
            state.selectedProveedor = action.payload;
        },
        addProveedor: (state, action: PayloadAction<Proveedor>) => {
            state.proveedores.push(action.payload);
        },
        updateProveedor: (state, action: PayloadAction<Proveedor>) => {
            const index = state.proveedores.findIndex(p => p._id === action.payload._id);
            if (index !== -1) {
                state.proveedores[index] = action.payload;
            }
        },
        removeProveedor: (state, action: PayloadAction<string>) => {
            state.proveedores = state.proveedores.filter(p => p._id !== action.payload);
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
    setSelectedProveedor,
    addProveedor,
    updateProveedor,
    removeProveedor,
    clearError,
} = proveedorSlice.actions;

export default proveedorSlice.reducer;