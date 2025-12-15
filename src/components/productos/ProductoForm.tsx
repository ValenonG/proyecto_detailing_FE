import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch } from '../../store/hooks';
import { createProducto, updateProducto, fetchProductos } from '../../store/slices/productosSlice';
import type { Producto } from '../../services/productoService';
import { personaService, type Persona } from '../../services/personaService';
import { X, AlertCircle } from 'lucide-react';

interface ProductoFormProps {
    producto?: Producto | null;
    onClose: () => void;
}

interface FormData {
    nombre: string;
    proveedor: string;
    precio_venta: number;
    stock_actual: number;
    stock_minimo: number;
}

function ProductoForm({ producto, onClose }: ProductoFormProps) {
    const dispatch = useAppDispatch();
    const [proveedores, setProveedores] = useState<Persona[]>([]);
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            nombre: producto?.nombre || '',
            proveedor: typeof producto?.proveedor === 'string' ? producto.proveedor : producto?.proveedor?._id || '',
            precio_venta: producto?.precio_venta || 0,
            stock_actual: producto?.stock_actual || 0,
            stock_minimo: producto?.stock_minimo || 5,
        },
    });

    useEffect(() => {
        const loadProveedores = async () => {
            try {
                const data = await personaService.getByTipo('Proveedor');
                setProveedores(data);
            } catch (error) {
                console.error('Error al cargar proveedores:', error);
            }
        };
        loadProveedores();
    }, []);

    const onSubmit = async (data: FormData) => {
        if (data.stock_minimo < 0 || data.stock_actual < 0 || data.precio_venta < 0) {
            alert('Los valores no pueden ser negativos');
            return;
        }

        setLoading(true);
        try {
            if (producto) {
                await dispatch(updateProducto({ id: producto._id, data }));
            } else {
                await dispatch(createProducto(data as Omit<Producto, '_id'>));
            }
            await dispatch(fetchProductos());
            onClose();
        } catch (error) {
            console.error('Error al guardar producto:', error);
            alert('Error al guardar el producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg w-full max-w-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">
                        {producto ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Nombre del Producto *
                        </label>
                        <Controller
                            name="nombre"
                            control={control}
                            rules={{ required: 'El nombre es requerido' }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="Ej: Cera para auto"
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                />
                            )}
                        />
                        {errors.nombre && (
                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle size={14} />
                                {errors.nombre.message}
                            </p>
                        )}
                    </div>

                    {/* Proveedor */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Proveedor *
                        </label>
                        <Controller
                            name="proveedor"
                            control={control}
                            rules={{ required: 'El proveedor es requerido' }}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">Seleccione un proveedor</option>
                                    {proveedores.map((prov) => (
                                        <option key={prov._id} value={prov._id}>
                                            {prov.nombre} {prov.apellido}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.proveedor && (
                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle size={14} />
                                {errors.proveedor.message}
                            </p>
                        )}
                    </div>

                    {/* Grid: Precio y Stocks */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Precio Venta */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Precio Venta *
                            </label>
                            <Controller
                                name="precio_venta"
                                control={control}
                                rules={{
                                    required: 'El precio es requerido',
                                    min: { value: 0, message: 'Debe ser mayor o igual a 0' }
                                }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    />
                                )}
                            />
                            {errors.precio_venta && (
                                <p className="text-red-400 text-sm mt-1">{errors.precio_venta.message}</p>
                            )}
                        </div>

                        {/* Stock Actual */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Stock Actual *
                            </label>
                            <Controller
                                name="stock_actual"
                                control={control}
                                rules={{
                                    required: 'El stock es requerido',
                                    min: { value: 0, message: 'Debe ser mayor o igual a 0' }
                                }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    />
                                )}
                            />
                            {errors.stock_actual && (
                                <p className="text-red-400 text-sm mt-1">{errors.stock_actual.message}</p>
                            )}
                        </div>

                        {/* Stock Mínimo */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Stock Mínimo *
                            </label>
                            <Controller
                                name="stock_minimo"
                                control={control}
                                rules={{
                                    required: 'El stock mínimo es requerido',
                                    min: { value: 0, message: 'Debe ser mayor o igual a 0' }
                                }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="number"
                                        min="0"
                                        placeholder="5"
                                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    />
                                )}
                            />
                            {errors.stock_minimo && (
                                <p className="text-red-400 text-sm mt-1">{errors.stock_minimo.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Información de stock bajo */}
                    <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-3">
                        <p className="text-yellow-400 text-sm flex items-center gap-2">
                            <AlertCircle size={16} />
                            El sistema alertará cuando el stock actual sea menor al stock mínimo
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 justify-end pt-2 border-t border-slate-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Guardando...' : producto ? 'Actualizar' : 'Crear Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductoForm;
