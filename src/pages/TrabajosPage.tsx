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

const estadoColors = {
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

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Está seguro de eliminar este trabajo?')) {
            await dispatch(deleteTrabajo(id));
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
                <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">
                            Cargando trabajos...
                        </div>
                    ) : filteredTrabajos.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            No se encontraron trabajos
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">#Orden</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Cliente</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Vehículo</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Estado</th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">Precio Total</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-slate-300">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {filteredTrabajos.map((trabajo, index) => {
                                        const vehiculo = typeof trabajo.vehiculo === 'object' ? trabajo.vehiculo : null;
                                        const cliente = vehiculo?.cliente;

                                        return (
                                            <tr key={trabajo._id} className="hover:bg-slate-700/50 transition-colors">
                                                <td className="px-4 py-3 text-white font-mono">
                                                    #{String(index + 1).padStart(4, '0')}
                                                </td>
                                                <td className="px-4 py-3 text-slate-300">
                                                    {cliente ? `${cliente.nombre} ${cliente.apellido}` : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-slate-300">
                                                    {vehiculo ? (
                                                        <div>
                                                            <div className="font-medium">{vehiculo.marca} {vehiculo.modelo}</div>
                                                            <div className="text-sm text-slate-400">{vehiculo.patente || 'Sin patente'}</div>
                                                        </div>
                                                    ) : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${estadoColors[trabajo.estado]}`}>
                                                        {trabajo.estado}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right text-white font-semibold">
                                                    ${trabajo.precio_total.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleViewDetail(trabajo)}
                                                            className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded transition-colors"
                                                            title="Ver detalle"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(trabajo)}
                                                            className="p-1.5 hover:bg-green-500/20 text-green-400 rounded transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(trabajo._id)}
                                                            className="p-1.5 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
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
        </DashboardLayout>
    );
}

export default TrabajosPage;
