import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import productoService, { type Producto } from '../../services/productoService';

interface ProductosState {
    productos: Producto[];
    selectedProducto: Producto | null;
    loading: boolean;
    error: string | null;
    searchTerm: string;
    filterLowStock: boolean;
}

const initialState: ProductosState = {
    productos: [],
    selectedProducto: null,
    loading: false,
    error: null,
    searchTerm: '',
    filterLowStock: false,
};

// Async thunks
export const fetchProductos = createAsyncThunk(
    'productos/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const productos = await productoService.getAll();
            return productos;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar productos');
        }
    }
);

export const createProducto = createAsyncThunk(
    'productos/create',
    async (productoData: Omit<Producto, '_id'>, { rejectWithValue }) => {
        try {
            const producto = await productoService.create(productoData);
            return producto;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al crear producto');
        }
    }
);

export const updateProducto = createAsyncThunk(
    'productos/update',
    async ({ id, data }: { id: string; data: Partial<Producto> }, { rejectWithValue }) => {
        try {
            const producto = await productoService.update(id, data);
            return producto;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al actualizar producto');
        }
    }
);

export const deleteProducto = createAsyncThunk(
    'productos/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await productoService.hardDelete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al eliminar producto');
        }
    }
);

const productosSlice = createSlice({
    name: 'productos',
    initialState,
    reducers: {
        setSelectedProducto: (state, action: PayloadAction<Producto | null>) => {
            state.selectedProducto = action.payload;
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        setFilterLowStock: (state, action: PayloadAction<boolean>) => {
            state.filterLowStock = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchProductos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductos.fulfilled, (state, action) => {
                state.loading = false;
                state.productos = action.payload;
            })
            .addCase(fetchProductos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create
            .addCase(createProducto.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProducto.fulfilled, (state, action) => {
                state.loading = false;
                state.productos.push(action.payload);
            })
            .addCase(createProducto.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateProducto.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProducto.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.productos.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.productos[index] = action.payload;
                }
            })
            .addCase(updateProducto.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteProducto.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProducto.fulfilled, (state, action) => {
                state.loading = false;
                state.productos = state.productos.filter(p => p._id !== action.payload);
            })
            .addCase(deleteProducto.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setSelectedProducto,
    setSearchTerm,
    setFilterLowStock,
    clearError,
} = productosSlice.actions;

export default productosSlice.reducer;
