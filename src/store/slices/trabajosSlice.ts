import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { trabajoService } from '../../services/trabajoService';
import type { Trabajo } from '../../services/trabajoService';

interface TrabajosState {
    trabajos: Trabajo[];
    selectedTrabajo: Trabajo | null;
    loading: boolean;
    error: string | null;
    filters: {
        estado: string | null;
        search: string;
    };
}

const initialState: TrabajosState = {
    trabajos: [],
    selectedTrabajo: null,
    loading: false,
    error: null,
    filters: {
        estado: null,
        search: '',
    },
};

// Async Thunks
export const fetchTrabajos = createAsyncThunk(
    'trabajos/fetchTrabajos',
    async (_, { rejectWithValue }) => {
        try {
            const trabajos = await trabajoService.getAll();
            return trabajos;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar trabajos');
        }
    }
);

export const fetchTrabajosByEstado = createAsyncThunk(
    'trabajos/fetchTrabajosByEstado',
    async (estado: string, { rejectWithValue }) => {
        try {
            const trabajos = await trabajoService.getByEstado(estado);
            return trabajos;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al filtrar trabajos');
        }
    }
);

export const createTrabajo = createAsyncThunk(
    'trabajos/createTrabajo',
    async (trabajo: Omit<Trabajo, '_id'>, { rejectWithValue }) => {
        try {
            const newTrabajo = await trabajoService.create(trabajo);
            return newTrabajo;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al crear trabajo');
        }
    }
);

export const updateTrabajo = createAsyncThunk(
    'trabajos/updateTrabajo',
    async ({ id, data }: { id: string; data: Partial<Trabajo> }, { rejectWithValue }) => {
        try {
            const updatedTrabajo = await trabajoService.update(id, data);
            return updatedTrabajo;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al actualizar trabajo');
        }
    }
);

export const deleteTrabajo = createAsyncThunk(
    'trabajos/deleteTrabajo',
    async (id: string, { rejectWithValue }) => {
        try {
            await trabajoService.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al eliminar trabajo');
        }
    }
);

// Slice
const trabajosSlice = createSlice({
    name: 'trabajos',
    initialState,
    reducers: {
        setSelectedTrabajo: (state, action: PayloadAction<Trabajo | null>) => {
            state.selectedTrabajo = action.payload;
        },
        setEstadoFilter: (state, action: PayloadAction<string | null>) => {
            state.filters.estado = action.payload;
        },
        setSearchFilter: (state, action: PayloadAction<string>) => {
            state.filters.search = action.payload;
        },
        clearFilters: (state) => {
            state.filters.estado = null;
            state.filters.search = '';
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Trabajos
            .addCase(fetchTrabajos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrabajos.fulfilled, (state, action) => {
                state.loading = false;
                state.trabajos = action.payload;
            })
            .addCase(fetchTrabajos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch by Estado
            .addCase(fetchTrabajosByEstado.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrabajosByEstado.fulfilled, (state, action) => {
                state.loading = false;
                state.trabajos = action.payload;
            })
            .addCase(fetchTrabajosByEstado.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Trabajo
            .addCase(createTrabajo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTrabajo.fulfilled, (state, action) => {
                state.loading = false;
                state.trabajos.unshift(action.payload);
            })
            .addCase(createTrabajo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Trabajo
            .addCase(updateTrabajo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTrabajo.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.trabajos.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.trabajos[index] = action.payload;
                }
                if (state.selectedTrabajo?._id === action.payload._id) {
                    state.selectedTrabajo = action.payload;
                }
            })
            .addCase(updateTrabajo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete Trabajo
            .addCase(deleteTrabajo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTrabajo.fulfilled, (state, action) => {
                state.loading = false;
                state.trabajos = state.trabajos.filter(t => t._id !== action.payload);
                if (state.selectedTrabajo?._id === action.payload) {
                    state.selectedTrabajo = null;
                }
            })
            .addCase(deleteTrabajo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setSelectedTrabajo,
    setEstadoFilter,
    setSearchFilter,
    clearFilters,
    clearError,
} = trabajosSlice.actions;

export default trabajosSlice.reducer;
