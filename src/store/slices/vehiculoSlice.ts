import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Vehiculo } from '../../types/vehiculo.types';

interface VehiculoState {
    vehiculos: Vehiculo[];
    selectedVehiculo: Vehiculo | null;
    loading: boolean;
    error: string | null;
}

const initialState: VehiculoState = {
    vehiculos: [],
    selectedVehiculo: null,
    loading: false,
    error: null,
};

const vehiculoSlice = createSlice({
    name: 'vehiculo',
    initialState,
    reducers: {
        fetchStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchSuccess: (state, action: PayloadAction<Vehiculo[]>) => {
            state.loading = false;
            state.vehiculos = action.payload;
            state.error = null;
        },
        fetchFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        setSelectedVehiculo: (state, action: PayloadAction<Vehiculo | null>) => {
            state.selectedVehiculo = action.payload;
        },
        addVehiculo: (state, action: PayloadAction<Vehiculo>) => {
            state.vehiculos.push(action.payload);
        },
        updateVehiculo: (state, action: PayloadAction<Vehiculo>) => {
            const index = state.vehiculos.findIndex(v => v._id === action.payload._id);
            if (index !== -1) {
                state.vehiculos[index] = action.payload;
            }
        },
        removeVehiculo: (state, action: PayloadAction<string>) => {
            state.vehiculos = state.vehiculos.filter(v => v._id !== action.payload);
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
    setSelectedVehiculo,
    addVehiculo,
    updateVehiculo,
    removeVehiculo,
    clearError,
} = vehiculoSlice.actions;

export default vehiculoSlice.reducer;
