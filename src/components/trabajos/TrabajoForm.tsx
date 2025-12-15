import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch } from '../../store/hooks';
import { createTrabajo, updateTrabajo, fetchTrabajos } from '../../store/slices/trabajosSlice';
import type { Trabajo, ProductoInfo, TareaInfo } from '../../services/trabajoService';
import { personaService, type Persona } from '../../services/personaService';
import { tareaService, type Tarea } from '../../services/tareaService';
import { productoService, type Producto } from '../../services/productoService';
import { X, Plus, Trash2 } from 'lucide-react';

interface VehiculoOption {
    _id: string;
    marca: string;
    modelo: string;
    patente?: string;
}

interface TrabajoFormProps {
    trabajo?: Trabajo | null;
    onClose: () => void;
}

interface FormData {
    vehiculo: string;
    observaciones: string;
    precio_total: number;
}

interface TareaSeleccionada {
    tarea_id: string;
    precio_al_momento: number;
    descripcion?: string;
}

interface ProductoSeleccionado {
    producto_id: string;
    cantidad: number;
    nombre?: string;
    precio_venta?: number;
    stock_actual?: number;
}

function TrabajoForm({ trabajo, onClose }: TrabajoFormProps) {
    const dispatch = useAppDispatch();

    // Estados para listas de opciones
    const [clientes, setClientes] = useState<Persona[]>([]);
    const [vehiculos, setVehiculos] = useState<VehiculoOption[]>([]);
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);

    // Estados para selección
    const [selectedCliente, setSelectedCliente] = useState<string>('');
    const [tareasSeleccionadas, setTareasSeleccionadas] = useState<TareaSeleccionada[]>([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);

    // Estados temporales para agregar tareas/productos
    const [tareaToAdd, setTareaToAdd] = useState<string>('');
    const [productoToAdd, setProductoToAdd] = useState<string>('');
    const [cantidadProducto, setCantidadProducto] = useState<number>(1);

    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
        defaultValues: {
            vehiculo: '',
            observaciones: '',
            precio_total: 0,
        },
    });

    const vehiculoSeleccionado = watch('vehiculo');

    // Cargar datos iniciales
    useEffect(() => {
        const loadData = async () => {
            try {
                const [clientesData, tareasData, productosData] = await Promise.all([
                    personaService.getByTipo('Cliente'),
                    tareaService.getAll(),
                    productoService.getAll(),
                ]);

                setClientes(clientesData);
                setTareas(tareasData);
                setProductos(productosData);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };

        loadData();
    }, []);

    // Cargar vehículos cuando cambia el cliente
    useEffect(() => {
        const loadVehiculos = async () => {
            if (selectedCliente) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/vehiculo/all`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    const data = await response.json();
                    const vehiculosCliente = data.data.filter(
                        (v: any) => v.cliente._id === selectedCliente || v.cliente === selectedCliente
                    );
                    setVehiculos(vehiculosCliente);
                } catch (error) {
                    console.error('Error al cargar vehículos:', error);
                }
            } else {
                setVehiculos([]);
                setValue('vehiculo', '');
            }
        };

        loadVehiculos();
    }, [selectedCliente, setValue]);

    // Calcular precio total
    useEffect(() => {
        const subtotalTareas = tareasSeleccionadas.reduce((sum, t) => sum + t.precio_al_momento, 0);
        const subtotalProductos = productosSeleccionados.reduce(
            (sum, p) => sum + (p.precio_venta || 0) * p.cantidad,
            0
        );
        setValue('precio_total', subtotalTareas + subtotalProductos);
    }, [tareasSeleccionadas, productosSeleccionados, setValue]);

    // Agregar tarea
    const handleAddTarea = () => {
        if (tareaToAdd) {
            const tarea = tareas.find(t => t._id === tareaToAdd);
            if (tarea && !tareasSeleccionadas.find(t => t.tarea_id === tareaToAdd)) {
                setTareasSeleccionadas([
                    ...tareasSeleccionadas,
                    {
                        tarea_id: tarea._id,
                        precio_al_momento: tarea.precio || 0,
                        descripcion: tarea.descripcion || 'Sin descripción',
                    },
                ]);
                setTareaToAdd('');
            }
        }
    };

    // Eliminar tarea
    const handleRemoveTarea = (tareaId: string) => {
        setTareasSeleccionadas(tareasSeleccionadas.filter(t => t.tarea_id !== tareaId));
    };

    // Agregar producto
    const handleAddProducto = () => {
        if (productoToAdd) {
            const producto = productos.find(p => p._id === productoToAdd);
            if (producto && !productosSeleccionados.find(p => p.producto_id === productoToAdd)) {
                if (cantidadProducto > producto.stock_actual) {
                    alert(`Stock insuficiente. Disponible: ${producto.stock_actual}`);
                    return;
                }

                setProductosSeleccionados([
                    ...productosSeleccionados,
                    {
                        producto_id: producto._id,
                        cantidad: cantidadProducto,
                        nombre: producto.nombre,
                        precio_venta: producto.precio_venta,
                        stock_actual: producto.stock_actual,
                    },
                ]);
                setProductoToAdd('');
                setCantidadProducto(1);
            }
        }
    };

    // Eliminar producto
    const handleRemoveProducto = (productoId: string) => {
        setProductosSeleccionados(productosSeleccionados.filter(p => p.producto_id !== productoId));
    };

    // Submit del formulario
    const onSubmit = async (data: FormData) => {
        console.log('onSubmit called', data);
        console.log('Tareas seleccionadas:', tareasSeleccionadas);
        console.log('Productos seleccionados:', productosSeleccionados);

        if (tareasSeleccionadas.length === 0) {
            alert('Debe seleccionar al menos una tarea');
            return;
        }

        setLoading(true);
        try {
            const trabajoData: any = {
                vehiculo: data.vehiculo,
                estado: trabajo?.estado || 'Pendiente',
                tareas: tareasSeleccionadas.map(t => ({
                    tarea: t.tarea_id,
                    precio_al_momento: t.precio_al_momento,
                })),
                productos_usados: productosSeleccionados.map(p => ({
                    producto: p.producto_id,
                    cantidad: p.cantidad,
                })),
                observaciones: data.observaciones || '',
                precio_total: data.precio_total,
            };

            console.log('Datos a enviar:', trabajoData);

            if (trabajo) {
                await dispatch(updateTrabajo({ id: trabajo._id, data: trabajoData }));
            } else {
                const result = await dispatch(createTrabajo(trabajoData));
                console.log('Resultado de crear trabajo:', result);
            }

            await dispatch(fetchTrabajos());
            onClose();
        } catch (error) {
            console.error('Error al guardar trabajo:', error);
            alert('Error al guardar el trabajo');
        } finally {
            setLoading(false);
        }
    };

    const subtotalTareas = tareasSeleccionadas.reduce((sum, t) => sum + t.precio_al_momento, 0);
    const subtotalProductos = productosSeleccionados.reduce(
        (sum, p) => sum + (p.precio_venta || 0) * p.cantidad,
        0
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-slate-800 rounded-lg w-full max-w-2xl my-8">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">
                        {trabajo ? 'Editar Orden de Trabajo' : 'Nueva Orden de Trabajo'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-h-[70vh]">
                    <div className="p-4 space-y-4 overflow-y-auto">
                        {/* Cliente */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Cliente *
                            </label>
                            <select
                                value={selectedCliente}
                                onChange={(e) => setSelectedCliente(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                required
                            >
                                <option value="">Seleccione un cliente</option>
                                {clientes.map((cliente) => (
                                    <option key={cliente._id} value={cliente._id}>
                                        {cliente.nombre} {cliente.apellido} - {cliente.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Vehículo */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Vehículo (ID) *
                            </label>
                            <Controller
                                name="vehiculo"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        disabled={!selectedCliente}
                                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">
                                            {selectedCliente ? 'Seleccione un vehículo' : 'Primero seleccione un cliente'}
                                        </option>
                                        {vehiculos.map((vehiculo) => (
                                            <option key={vehiculo._id} value={vehiculo._id}>
                                                {vehiculo.marca} {vehiculo.modelo} {vehiculo.patente ? `- ${vehiculo.patente}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                            {errors.vehiculo && (
                                <p className="text-red-400 text-sm mt-1">{errors.vehiculo.message}</p>
                            )}
                        </div>

                        {/* Tareas */}
                        <div className="border border-slate-700 rounded-lg p-3">
                            <h3 className="text-base font-semibold text-white mb-2">Tareas</h3>

                            {/* Agregar tarea */}
                            <div className="flex gap-2 mb-2">
                                <select
                                    value={tareaToAdd}
                                    onChange={(e) => setTareaToAdd(e.target.value)}
                                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">Seleccione una tarea</option>
                                    {tareas
                                        .filter(t => !tareasSeleccionadas.find(ts => ts.tarea_id === t._id))
                                        .map((tarea) => (
                                            <option key={tarea._id} value={tarea._id}>
                                                {tarea.descripcion} - ${tarea.precio.toLocaleString()}
                                            </option>
                                        ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={handleAddTarea}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                                >
                                    <Plus size={18} />
                                    Agregar
                                </button>
                            </div>

                            {/* Lista de tareas seleccionadas */}
                            {tareasSeleccionadas.length > 0 ? (
                                <div className="space-y-2">
                                    {tareasSeleccionadas.map((tarea) => (
                                        <div
                                            key={tarea.tarea_id}
                                            className="flex items-center justify-between bg-slate-700 p-3 rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{tarea.descripcion}</p>
                                                <p className="text-sm text-slate-400">
                                                    ${(tarea.precio_al_momento || 0).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTarea(tarea.tarea_id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="pt-2 border-t border-slate-600">
                                        <p className="text-right text-white font-semibold">
                                            Subtotal Tareas: ${(subtotalTareas || 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-400 text-sm text-center py-4">
                                    No hay tareas seleccionadas
                                </p>
                            )}
                        </div>

                        {/* Productos */}
                        <div className="border border-slate-700 rounded-lg p-3">
                            <h3 className="text-base font-semibold text-white mb-2">Productos (Opcional)</h3>

                            {/* Agregar producto */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                                <select
                                    value={productoToAdd}
                                    onChange={(e) => setProductoToAdd(e.target.value)}
                                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 col-span-2"
                                >
                                    <option value="">Seleccione un producto</option>
                                    {productos
                                        .filter(p => !productosSeleccionados.find(ps => ps.producto_id === p._id))
                                        .map((producto) => (
                                            <option key={producto._id} value={producto._id}>
                                                {producto.nombre} - ${producto.precio_venta.toLocaleString()} (Stock: {producto.stock_actual})
                                            </option>
                                        ))}
                                </select>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        min="1"
                                        value={cantidadProducto}
                                        onChange={(e) => setCantidadProducto(Number(e.target.value))}
                                        placeholder="Cant."
                                        className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddProducto}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                                    >
                                        <Plus size={18} />
                                        Agregar
                                    </button>
                                </div>
                            </div>

                            {/* Lista de productos seleccionados */}
                            {productosSeleccionados.length > 0 ? (
                                <div className="space-y-2">
                                    {productosSeleccionados.map((producto) => (
                                        <div
                                            key={producto.producto_id}
                                            className="flex items-center justify-between bg-slate-700 p-3 rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{producto.nombre}</p>
                                                <p className="text-sm text-slate-400">
                                                    {producto.cantidad} x ${producto.precio_venta?.toLocaleString()} = ${((producto.precio_venta || 0) * producto.cantidad).toLocaleString()}
                                                    <span className="ml-2 text-green-400">
                                                        (Stock disponible: {producto.stock_actual})
                                                    </span>
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProducto(producto.producto_id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="pt-2 border-t border-slate-600">
                                        <p className="text-right text-white font-semibold">
                                            Subtotal Productos: ${(subtotalProductos || 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-400 text-sm text-center py-4">
                                    No hay productos seleccionados
                                </p>
                            )}
                        </div>

                        {/* Observaciones */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Observaciones (Opcional)
                            </label>
                            <Controller
                                name="observaciones"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        rows={2}
                                        placeholder="Detalles del trabajo..."
                                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                                    />
                                )}
                            />
                        </div>

                        {/* Precio Total */}
                        <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-base font-semibold text-white">PRECIO TOTAL</span>
                                <span className="text-xl font-bold text-blue-400">
                                    ${(watch('precio_total') || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 justify-end p-4 border-t border-slate-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {loading ? 'Guardando...' : trabajo ? 'Actualizar' : 'Crear Orden'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TrabajoForm;
