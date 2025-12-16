import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchTrabajos,
    setEstadoFilter,
    setSearchFilter,
    setSelectedTrabajo,
    deleteTrabajo,
} from '../store/slices/trabajosSlice';
import type { Trabajo } from '../services/trabajoService';
import { Wrench, Plus, Search, Filter, Eye, Trash2, Edit } from 'lucide-react';
import TrabajoForm from '../components/trabajos/TrabajoForm';
import TrabajoDetail from '../components/trabajos/TrabajoDetail';
import { Table, ConfirmModal } from '../components/ui';

const estadoColors: Record<string, string> = {
    Pendiente: 'bg-yellow-500/10 text-yellow-500 border-yellow-500',
    'En Proceso': 'bg-blue-500/10 text-blue-500 border-blue-500',
    Terminado: 'bg-green-500/10 text-green-500 border-green-500',
    Entregado: 'bg-gray-500/10 text-gray-500 border-gray-500',
};

function TrabajosPage() {
    const dispatch = useAppDispatch();
    const { trabajos, loading, filters } = useAppSelector((state) => state.trabajos);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [trabajoToEdit, setTrabajoToEdit] = useState<Trabajo | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; trabajo: Trabajo | null }>({
        show: false,
        trabajo: null
    });

    useEffect(() => {
        dispatch(fetchTrabajos());
    }, [dispatch]);

    // Filtrar trabajos
    const filteredTrabajos = (trabajos || []).filter((trabajo) => {
        const matchesEstado = !filters.estado || trabajo.estado === filters.estado;

        let matchesSearch = true;
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const vehiculo = typeof trabajo.vehiculo === 'object' ? trabajo.vehiculo : null;
            const cliente = vehiculo?.cliente;

            matchesSearch =
                vehiculo?.marca?.toLowerCase().includes(searchLower) ||
                vehiculo?.modelo?.toLowerCase().includes(searchLower) ||
                vehiculo?.patente?.toLowerCase().includes(searchLower) ||
                cliente?.nombre?.toLowerCase().includes(searchLower) ||
                cliente?.apellido?.toLowerCase().includes(searchLower) ||
                false;
        }

        return matchesEstado && matchesSearch;
    });

    // Contar trabajos por estado
    const estadoCounts = {
        Pendiente: (trabajos || []).filter(t => t.estado === 'Pendiente').length,
        'En Proceso': (trabajos || []).filter(t => t.estado === 'En Proceso').length,
        Terminado: (trabajos || []).filter(t => t.estado === 'Terminado').length,
        Entregado: (trabajos || []).filter(t => t.estado === 'Entregado').length,
    };

    const handleDeleteClick = (trabajo: Trabajo) => {
        setConfirmDelete({ show: true, trabajo });
    };

    const handleDeleteConfirm = async () => {
        if (confirmDelete.trabajo) {
            await dispatch(deleteTrabajo(confirmDelete.trabajo._id));
            setConfirmDelete({ show: false, trabajo: null });
        }
    };

    const handleViewDetail = (trabajo: Trabajo) => {
        dispatch(setSelectedTrabajo(trabajo));
        setShowDetailModal(true);
    };

    const handleEdit = (trabajo: Trabajo) => {
        setTrabajoToEdit(trabajo);
        setShowCreateModal(true);
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setTrabajoToEdit(null);
    };

    const columns = [
        {
            key: '_id',
            title: '#Orden',
            render: (_: any, __: any, index: number) => (
                <span className="font-mono text-white">#{String(index + 1).padStart(4, '0')}</span>
            )
        },
        {
            key: 'cliente',
            title: 'Cliente',
            render: (_: any, trabajo: Trabajo) => {
                const vehiculo = typeof trabajo.vehiculo === 'object' ? trabajo.vehiculo : null;
                const cliente = vehiculo?.cliente;
                return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'N/A';
            }
        },
        {
            key: 'vehiculo',
            title: 'Vehículo',
            render: (_: any, trabajo: Trabajo) => {
                const vehiculo = typeof trabajo.vehiculo === 'object' ? trabajo.vehiculo : null;
                return vehiculo ? (
                    <div>
                        <div className="font-medium">{vehiculo.marca} {vehiculo.modelo}</div>
                        <div className="text-sm text-slate-400">{vehiculo.patente || 'Sin patente'}</div>
                    </div>
                ) : 'N/A';
            }
        },
        {
            key: 'estado',
            title: 'Estado',
            render: (estado: string) => (
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${estadoColors[estado] || ''}`}>
                    {estado}
                </span>
            )
        },
        {
            key: 'precio_total',
            title: 'Precio Total',
            className: 'text-right',
            render: (precio: number) => (
                <div className="text-right font-semibold text-white">
                    ${precio.toLocaleString()}
                </div>
            )
        },
        {
            key: 'actions',
            title: 'Acciones',
            render: (_: any, trabajo: Trabajo) => (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetail(trabajo);
                        }}
                        className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded transition-colors"
                        title="Ver detalle"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(trabajo);
                        }}
                        className="p-1.5 hover:bg-green-500/20 text-green-400 rounded transition-colors"
                        title="Editar"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(trabajo);
                        }}
                        className="p-1.5 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                        title="Eliminar"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            <Wrench size={32} className="text-blue-500" />
                            Órdenes de Trabajo
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Gestiona las órdenes de servicio del taller
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                        <Plus size={20} />
                        Nueva Orden
                    </button>
                </div>

                {/* Filtros */}
                <div className="bg-slate-800 rounded-lg p-4 space-y-4">
                    {/* Búsqueda */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por cliente, vehículo o patente..."
                            value={filters.search}
                            onChange={(e) => dispatch(setSearchFilter(e.target.value))}
                            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Filtros de estado */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <Filter size={20} className="text-slate-400" />
                        <button
                            onClick={() => dispatch(setEstadoFilter(null))}
                            className={`px-3 py-1 rounded-lg transition-colors ${filters.estado === null
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                        >
                            Todos ({(trabajos || []).length})
                        </button>
                        {Object.entries(estadoCounts).map(([estado, count]) => (
                            <button
                                key={estado}
                                onClick={() => dispatch(setEstadoFilter(estado))}
                                className={`px-3 py-1 rounded-lg transition-colors ${filters.estado === estado
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }`}
                            >
                                {estado} ({count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tabla de trabajos */}
                <Table
                    data={filteredTrabajos}
                    columns={columns}
                    keyExtractor={(trabajo) => trabajo._id}
                    loading={loading}
                    emptyMessage="No se encontraron trabajos"
                />
            </div>

            {/* Modal de creación/edición */}
            {showCreateModal && (
                <TrabajoForm
                    trabajo={trabajoToEdit}
                    onClose={handleCloseModal}
                />
            )}

            {/* Modal de detalle */}
            {showDetailModal && (
                <TrabajoDetail
                    onClose={() => setShowDetailModal(false)}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmDelete.show}
                onClose={() => setConfirmDelete({ show: false, trabajo: null })}
                onConfirm={handleDeleteConfirm}
                title="Confirmar Eliminación"
                message={
                    confirmDelete.trabajo 
                        ? `¿Estás seguro que deseas eliminar la orden de trabajo #${String(filteredTrabajos.findIndex(t => t._id === confirmDelete.trabajo?._id) + 1).padStart(4, '0')}? Esta acción no se puede deshacer.`
                        : "¿Estás seguro que deseas eliminar esta orden de trabajo?"
                }
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
            />
        </DashboardLayout>
    );
}

export default TrabajosPage;
