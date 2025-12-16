import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components';
import { Table, ConfirmModal } from '../components/ui';
import { ProveedorForm } from '../components/ui/ProveedorForm'; 
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchStart,
    fetchSuccess,
    fetchFailure,
    addProveedor,
    updateProveedor,
    removeProveedor,
} from '../store/slices/proveedorSlice';
import { proveedorService } from '../services/proveedorService';
import type { Proveedor } from '../types/proveedor.types';
import { UserPlus, Edit, Trash2, Search } from 'lucide-react';

function Proveedores() {
    const dispatch = useAppDispatch();
    // Nota: Accedemos a state.proveedor (singular) como definimos en el store
    const { proveedores, loading, error } = useAppSelector((state) => state.proveedor);

    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [proveedorToEdit, setProveedorToEdit] = useState<Proveedor | null>(null);
    const [proveedorToDelete, setProveedorToDelete] = useState<Proveedor | null>(null);

    useEffect(() => {
        loadProveedores();
    }, []);

    const loadProveedores = async () => {
        try {
            dispatch(fetchStart());
            const data = await proveedorService.getAll();
            dispatch(fetchSuccess(data));
        } catch (err) {
            dispatch(fetchFailure(err instanceof Error ? err.message : 'Error al cargar proveedores'));
        }
    };

    const handleEdit = (proveedor: Proveedor) => {
        setProveedorToEdit(proveedor);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (proveedor: Proveedor) => {
        setProveedorToDelete(proveedor);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!proveedorToDelete) return;

        try {
            await proveedorService.delete(proveedorToDelete._id);
            dispatch(removeProveedor(proveedorToDelete._id));
            setProveedorToDelete(null);
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error('Error al eliminar proveedor:', err);
            alert('Error al eliminar el proveedor');
        }
    };

    const filteredProveedores = proveedores.filter((proveedor) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            proveedor.nombre.toLowerCase().includes(searchLower) ||
            proveedor.apellido.toLowerCase().includes(searchLower) ||
            proveedor.dni.includes(searchTerm) ||
            (proveedor.cuit && proveedor.cuit.includes(searchTerm)) ||
            proveedor.email.toLowerCase().includes(searchLower)
        );
    });

    const columns = [
        {
            key: 'nombre',
            title: 'Nombre',
            render: (_: string, proveedor: Proveedor) => `${proveedor.nombre} ${proveedor.apellido}`,
        },
        {
            key: 'dni',
            title: 'DNI / CUIT',
            render: (_: string, proveedor: Proveedor) => proveedor.cuit || proveedor.dni,
        },
        {
            key: 'email',
            title: 'Email',
        },
        {
            key: 'telefono',
            title: 'Teléfono',
            render: (telefono: string) => telefono || '-',
        },
        {
            key: 'actions',
            title: 'Acciones',
            render: (_: unknown, proveedor: Proveedor) => (
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(proveedor);
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                        title="Editar"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(proveedor);
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
                        <h1 className="text-3xl font-bold text-white mb-2">Proveedores</h1>
                        <p className="text-slate-400">Gestión de proveedores del sistema</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <UserPlus size={20} />
                        Nuevo Proveedor
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
                            placeholder="Buscar por nombre, DNI, CUIT o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                <Table
                    data={filteredProveedores}
                    columns={columns}
                    keyExtractor={(proveedor) => proveedor._id}
                    loading={loading}
                    emptyMessage="No se encontraron proveedores"
                />

                {/* Create Modal */}
                {isCreateModalOpen && (
                    <ProveedorForm
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        onSuccess={(newProveedor: Proveedor) => {
                            dispatch(addProveedor(newProveedor));
                            // Nota: El modal se cierra dentro del form al tener éxito, 
                            // pero por seguridad mantenemos esto aquí o lo dejamos manejar al form.
                            // Según tu código anterior, el form llama a onSuccess y luego podemos cerrar.
                             setIsCreateModalOpen(false);
                        }}
                    />
                )}

                {/* Edit Modal */}
                {isEditModalOpen && proveedorToEdit && (
                    <ProveedorForm
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setProveedorToEdit(null);
                        }}
                        initialData={proveedorToEdit}
                        onSuccess={(updatedProveedor: Proveedor) => {
                            dispatch(updateProveedor(updatedProveedor));
                            setIsEditModalOpen(false);
                            setProveedorToEdit(null);
                        }}
                    />
                )}

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setProveedorToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Eliminar Proveedor"
                    message={`¿Está seguro que desea eliminar al proveedor ${proveedorToDelete?.nombre} ${proveedorToDelete?.apellido}? Esta acción no se puede deshacer.`}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                    variant="danger"
                />
            </div>
        </DashboardLayout>
    );
}

export default Proveedores;