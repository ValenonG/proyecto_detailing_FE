import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components';
import { Table, ConfirmModal, VehiculoForm } from '../components/ui';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchStart,
    fetchSuccess,
    fetchFailure,
    addVehiculo,
    updateVehiculo,
    removeVehiculo,
} from '../store/slices/vehiculoSlice';
import { vehiculoService, clienteService } from '../services';
import type { Vehiculo } from '../types/vehiculo.types';
import type { Cliente } from '../types/cliente.types';
import { Car, Edit, Trash2, Search } from 'lucide-react';

function Vehiculos() {
    const dispatch = useAppDispatch();
    const { vehiculos, loading, error } = useAppSelector((state) => state.vehiculo);

    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [vehiculoToEdit, setVehiculoToEdit] = useState<Vehiculo | null>(null);
    const [vehiculoToDelete, setVehiculoToDelete] = useState<Vehiculo | null>(null);
    const [clientesMap, setClientesMap] = useState<Record<string, Cliente>>({});

    useEffect(() => {
        loadVehiculos();
        loadClientes();
    }, []);

    const loadVehiculos = async () => {
        try {
            dispatch(fetchStart());
            const data = await vehiculoService.getAll();
            dispatch(fetchSuccess(data));
        } catch (err) {
            dispatch(fetchFailure(err instanceof Error ? err.message : 'Error al cargar vehículos'));
        }
    };

    const loadClientes = async () => {
        try {
            const data = await clienteService.getAll();
            const map: Record<string, Cliente> = {};
            data.forEach((cliente) => {
                map[cliente._id] = cliente;
            });
            setClientesMap(map);
        } catch (err) {
            console.error('Error al cargar clientes:', err);
        }
    };

    const handleEdit = (vehiculo: Vehiculo) => {
        setVehiculoToEdit(vehiculo);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (vehiculo: Vehiculo) => {
        setVehiculoToDelete(vehiculo);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!vehiculoToDelete) return;

        try {
            await vehiculoService.delete(vehiculoToDelete._id);
            dispatch(removeVehiculo(vehiculoToDelete._id));
            setVehiculoToDelete(null);
        } catch (err) {
            console.error('Error al eliminar vehículo:', err);
            alert('Error al eliminar el vehículo');
        }
    };

    const filteredVehiculos = vehiculos.filter((vehiculo) => {
        const searchLower = searchTerm.toLowerCase();
        const cliente = clientesMap[vehiculo.cliente];
        const clienteNombre = cliente ? `${cliente.nombre} ${cliente.apellido}` : '';
        const patente = vehiculo.patente || '';

        return (
            patente.toLowerCase().includes(searchLower) ||
            vehiculo.marca.toLowerCase().includes(searchLower) ||
            vehiculo.modelo.toLowerCase().includes(searchLower) ||
            clienteNombre.toLowerCase().includes(searchLower)
        );
    });

    const columns = [
        {
            key: 'patente',
            title: 'Patente',
            render: (patente?: string) => (
                <span className="font-mono font-semibold">{patente ? patente.toUpperCase() : 'Sin patente'}</span>
            ),
        },
        {
            key: 'marca',
            title: 'Marca',
        },
        {
            key: 'modelo',
            title: 'Modelo',
        },
        {
            key: 'cliente',
            title: 'Cliente',
            render: (clienteId: string) => {
                const cliente = clientesMap[clienteId];
                return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cargando...';
            },
        },
        {
            key: 'actions',
            title: 'Acciones',
            render: (_: unknown, vehiculo: Vehiculo) => (
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(vehiculo);
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                        title="Editar"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(vehiculo);
                        }}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                        title="Eliminar"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Vehículos</h1>
                        <p className="text-slate-400">Gestión de vehículos del sistema</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <Car size={20} />
                        Nuevo Vehículo
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                <div className="bg-slate-800 rounded-lg p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por patente, marca, modelo o cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                <Table
                    data={filteredVehiculos}
                    columns={columns}
                    keyExtractor={(vehiculo) => vehiculo._id}
                    loading={loading}
                    emptyMessage="No se encontraron vehículos"
                />

                {/* Create Modal */}
                {isCreateModalOpen && (
                    <VehiculoForm
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        onSuccess={(newVehiculo: Vehiculo) => {
                            dispatch(addVehiculo(newVehiculo));
                            setIsCreateModalOpen(false);
                        }}
                    />
                )}

                {/* Edit Modal */}
                {isEditModalOpen && vehiculoToEdit && (
                    <VehiculoForm
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setVehiculoToEdit(null);
                        }}
                        initialData={vehiculoToEdit}
                        onSuccess={(updatedVehiculo: Vehiculo) => {
                            dispatch(updateVehiculo(updatedVehiculo));
                            setIsEditModalOpen(false);
                            setVehiculoToEdit(null);
                        }}
                    />
                )}

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setVehiculoToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Eliminar Vehículo"
                    message={`¿Está seguro que desea eliminar el vehículo ${vehiculoToDelete?.patente ? vehiculoToDelete.patente.toUpperCase() : 'sin patente'} (${vehiculoToDelete?.marca} ${vehiculoToDelete?.modelo})? Esta acción no se puede deshacer.`}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                    variant="danger"
                />
            </div>
        </DashboardLayout>
    );
}

export default Vehiculos;
