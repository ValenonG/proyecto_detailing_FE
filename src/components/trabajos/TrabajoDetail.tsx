import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSelectedTrabajo, updateTrabajo, fetchTrabajos } from '../../store/slices/trabajosSlice';
import type { Trabajo, Vehiculo, TareaInfo, ProductoInfo } from '../../services/trabajoService';
import { X, Calendar, DollarSign, Package, Wrench, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface TrabajoDetailProps {
    onClose: () => void;
}

interface ConfirmModal {
    show: boolean;
    title: string;
    message: string;
    type: 'confirm' | 'error' | 'success';
    onConfirm?: () => void;
    onCancel?: () => void;
}

const estadoColors = {
    Pendiente: 'bg-yellow-500/10 text-yellow-500 border-yellow-500',
    'En Proceso': 'bg-blue-500/10 text-blue-500 border-blue-500',
    Terminado: 'bg-green-500/10 text-green-500 border-green-500',
    Entregado: 'bg-gray-500/10 text-gray-500 border-gray-500',
};

const estadoOrder: Record<string, number> = {
    Pendiente: 0,
    'En Proceso': 1,
    Terminado: 2,
    Entregado: 3,
};

function TrabajoDetail({ onClose }: TrabajoDetailProps) {
    const dispatch = useAppDispatch();
    const selectedTrabajo = useAppSelector((state) => state.trabajos.selectedTrabajo);
    const [updating, setUpdating] = useState(false);
    const [confirmModal, setConfirmModal] = useState<ConfirmModal>({
        show: false,
        title: '',
        message: '',
        type: 'confirm'
    });

    if (!selectedTrabajo) {
        onClose();
        return null;
    }

    const trabajo = selectedTrabajo;
    const vehiculo = typeof trabajo.vehiculo === 'object' ? trabajo.vehiculo as Vehiculo : null;
    const cliente = vehiculo?.cliente;

    const handleChangeEstado = async (nuevoEstado: typeof trabajo.estado) => {
        // Validar que no se retroceda
        if (estadoOrder[nuevoEstado] < estadoOrder[trabajo.estado]) {
            setConfirmModal({
                show: true,
                title: 'Acción no permitida',
                message: 'No se puede retroceder el estado de un trabajo',
                type: 'error'
            });
            return;
        }

        // Validar stock antes de pasar a Terminado
        if (nuevoEstado === 'Terminado' && trabajo.productos_usados.length > 0) {
            const productosConProblemas: string[] = [];

            for (const prod of trabajo.productos_usados) {
                const producto = typeof prod.producto === 'object' ? prod.producto as ProductoInfo : null;
                if (producto && producto.stock_actual < prod.cantidad) {
                    productosConProblemas.push(
                        `${producto.nombre}: Disponible ${producto.stock_actual}, Requerido ${prod.cantidad}`
                    );
                }
            }

            if (productosConProblemas.length > 0) {
                setConfirmModal({
                    show: true,
                    title: 'Stock insuficiente',
                    message: `No se puede finalizar el trabajo. Stock insuficiente:\n\n${productosConProblemas.join('\n')}`,
                    type: 'error'
                });
                return;
            }
        }

        // Mostrar confirmación
        setConfirmModal({
            show: true,
            title: 'Confirmar cambio de estado',
            message: `¿Cambiar estado de "${trabajo.estado}" a "${nuevoEstado}"?`,
            type: 'confirm',
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, show: false }));
                setUpdating(true);
                try {
                    await dispatch(updateTrabajo({
                        id: trabajo._id,
                        data: { estado: nuevoEstado }
                    }));
                    await dispatch(fetchTrabajos());
                    dispatch(setSelectedTrabajo({ ...trabajo, estado: nuevoEstado }));
                } catch (error) {
                    console.error('Error al actualizar estado:', error);
                    setConfirmModal({
                        show: true,
                        title: 'Error',
                        message: 'Error al actualizar el estado del trabajo',
                        type: 'error'
                    });
                } finally {
                    setUpdating(false);
                }
            },
            onCancel: () => {
                setConfirmModal(prev => ({ ...prev, show: false }));
            }
        });
    };

    const getNextEstado = (): typeof trabajo.estado | null => {
        const estados: (typeof trabajo.estado)[] = ['Pendiente', 'En Proceso', 'Terminado', 'Entregado'];
        const currentIndex = estados.indexOf(trabajo.estado);
        if (currentIndex < estados.length - 1) {
            return estados[currentIndex + 1];
        }
        return null;
    };

    const nextEstado = getNextEstado();

    const subtotalTareas = trabajo.tareas.reduce((sum, t) => sum + t.precio_al_momento, 0);
    const subtotalProductos = trabajo.productos_usados.reduce((sum, p) => {
        const producto = typeof p.producto === 'object' ? p.producto as ProductoInfo : null;
        return sum + (producto?.precio_venta || 0) * p.cantidad;
    }, 0);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-slate-800 rounded-lg w-full max-w-2xl my-8">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-white">Detalle de Orden de Trabajo</h2>
                        <p className="text-slate-400 text-xs mt-1">
                            Órden #{trabajo._id.slice(-8).toUpperCase()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Estado y Acciones */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Estado actual</p>
                            <span className={`inline-block px-3 py-1 rounded text-sm font-medium border ${estadoColors[trabajo.estado]}`}>
                                {trabajo.estado}
                            </span>
                        </div>
                        {nextEstado && (
                            <button
                                onClick={() => handleChangeEstado(nextEstado)}
                                disabled={updating}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
                            >
                                {updating ? 'Actualizando...' : `Cambiar a "${nextEstado}"`}
                            </button>
                        )}
                    </div>

                    {/* Cliente y Vehículo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-700 rounded-lg p-3">
                            <h3 className="text-xs font-semibold text-slate-300 mb-2">Cliente</h3>
                            {cliente ? (
                                <div>
                                    <p className="text-white font-medium">
                                        {cliente.nombre} {cliente.apellido}
                                    </p>
                                    <p className="text-slate-400 text-sm">{cliente.email}</p>
                                </div>
                            ) : (
                                <p className="text-slate-400">No disponible</p>
                            )}
                        </div>

                        <div className="bg-slate-700 rounded-lg p-3">
                            <h3 className="text-xs font-semibold text-slate-300 mb-2">Vehículo</h3>
                            {vehiculo ? (
                                <div>
                                    <p className="text-white font-medium">
                                        {vehiculo.marca} {vehiculo.modelo}
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                        {vehiculo.patente || 'Sin patente'}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-slate-400">No disponible</p>
                            )}
                        </div>
                    </div>

                    {/* Tareas */}
                    <div className="bg-slate-700 rounded-lg p-3">
                        <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                            <Wrench size={18} className="text-blue-500" />
                            Tareas
                        </h3>
                        {trabajo.tareas.length > 0 ? (
                            <div className="space-y-2">
                                {trabajo.tareas.map((t, index) => {
                                    const tarea = typeof t.tarea === 'object' ? t.tarea as TareaInfo : null;
                                    return (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center bg-slate-800 p-3 rounded"
                                        >
                                            <div>
                                                <p className="text-white font-medium">
                                                    {tarea?.descripcion || 'Tarea desconocida'}
                                                </p>
                                                {tarea?.tiempo_estimado && (
                                                    <p className="text-slate-400 text-sm">
                                                        Tiempo estimado: {tarea.tiempo_estimado} min
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-white font-semibold">
                                                ${t.precio_al_momento.toLocaleString()}
                                            </p>
                                        </div>
                                    );
                                })}
                                <div className="pt-2 border-t border-slate-600">
                                    <p className="text-right text-white font-semibold">
                                        Subtotal Tareas: ${subtotalTareas.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm">No hay tareas</p>
                        )}
                    </div>

                    {/* Productos */}
                    {trabajo.productos_usados.length > 0 && (
                        <div className="bg-slate-700 rounded-lg p-3">
                            <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                                <Package size={18} className="text-green-500" />
                                Productos Utilizados
                            </h3>
                            <div className="space-y-2">
                                {trabajo.productos_usados.map((p, index) => {
                                    const producto = typeof p.producto === 'object' ? p.producto as ProductoInfo : null;
                                    const stockInsuficiente = producto && producto.stock_actual < p.cantidad;

                                    return (
                                        <div
                                            key={index}
                                            className={`flex justify-between items-center bg-slate-800 p-3 rounded ${stockInsuficiente ? 'border border-red-500' : ''
                                                }`}
                                        >
                                            <div className="flex-1">
                                                <p className="text-white font-medium">
                                                    {producto?.nombre || 'Producto desconocido'}
                                                </p>
                                                <p className="text-slate-400 text-sm">
                                                    {p.cantidad} x ${producto?.precio_venta.toLocaleString() || 0}
                                                    {producto && (
                                                        <span
                                                            className={`ml-2 ${stockInsuficiente ? 'text-red-400' : 'text-green-400'
                                                                }`}
                                                        >
                                                            (Stock: {producto.stock_actual})
                                                        </span>
                                                    )}
                                                </p>
                                                {stockInsuficiente && (
                                                    <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
                                                        <AlertCircle size={14} />
                                                        Stock insuficiente
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-white font-semibold">
                                                ${((producto?.precio_venta || 0) * p.cantidad).toLocaleString()}
                                            </p>
                                        </div>
                                    );
                                })}
                                <div className="pt-2 border-t border-slate-600">
                                    <p className="text-right text-white font-semibold">
                                        Subtotal Productos: ${subtotalProductos.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Observaciones */}
                    {trabajo.observaciones && (
                        <div className="bg-slate-700 rounded-lg p-3">
                            <h3 className="text-xs font-semibold text-slate-300 mb-2">Observaciones</h3>
                            <p className="text-white whitespace-pre-wrap">{trabajo.observaciones}</p>
                        </div>
                    )}

                    {/* Precio Total */}
                    <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <DollarSign size={20} className="text-blue-400" />
                                <span className="text-base font-semibold text-white">PRECIO TOTAL</span>
                            </div>
                            <span className="text-2xl font-bold text-blue-400">
                                ${trabajo.precio_total.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {trabajo.createdAt && (
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <Calendar size={16} />
                                <span>Creado: {new Date(trabajo.createdAt).toLocaleString('es-AR')}</span>
                            </div>
                        )}
                        {trabajo.updatedAt && (
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <Calendar size={16} />
                                <span>Actualizado: {new Date(trabajo.updatedAt).toLocaleString('es-AR')}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>

            {/* Custom Confirmation Modal */}
            {confirmModal.show && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
                    <div className="bg-slate-800 rounded-lg max-w-md w-full mx-4 shadow-2xl border border-slate-700">
                        {/* Header con icono según tipo */}
                        <div className={`p-4 border-b border-slate-700 flex items-center gap-3 ${confirmModal.type === 'error' ? 'bg-red-500/10' :
                                confirmModal.type === 'success' ? 'bg-green-500/10' :
                                    'bg-blue-500/10'
                            }`}>
                            {confirmModal.type === 'error' && (
                                <AlertTriangle size={24} className="text-red-500 flex-shrink-0" />
                            )}
                            {confirmModal.type === 'success' && (
                                <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
                            )}
                            {confirmModal.type === 'confirm' && (
                                <AlertCircle size={24} className="text-blue-500 flex-shrink-0" />
                            )}
                            <h3 className="font-bold text-white text-lg">{confirmModal.title}</h3>
                        </div>

                        {/* Mensaje */}
                        <div className="p-6">
                            <p className="text-slate-300 whitespace-pre-line">{confirmModal.message}</p>
                        </div>

                        {/* Botones */}
                        <div className="p-4 border-t border-slate-700 flex justify-end gap-2">
                            {confirmModal.type === 'confirm' && confirmModal.onCancel && (
                                <button
                                    onClick={confirmModal.onCancel}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    if (confirmModal.onConfirm) {
                                        confirmModal.onConfirm();
                                    } else {
                                        setConfirmModal(prev => ({ ...prev, show: false }));
                                    }
                                }}
                                className={`px-4 py-2 text-white rounded-lg transition-colors ${confirmModal.type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                                        confirmModal.type === 'success' ? 'bg-green-600 hover:bg-green-700' :
                                            'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {confirmModal.type === 'confirm' ? 'Confirmar' : 'Aceptar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TrabajoDetail;
