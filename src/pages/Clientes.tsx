import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components';
import { Table, ConfirmModal, ClienteForm } from '../components/ui';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchStart,
    fetchSuccess,
    fetchFailure,
    addCliente,
    updateCliente,
    removeCliente,
} from '../store/slices/clienteSlice';
import { clienteService } from '../services';
import type { Cliente } from '../types/cliente.types';
import { UserPlus, Edit, Trash2, Search } from 'lucide-react';

function Clientes() {
    const dispatch = useAppDispatch();
    const { clientes, loading, error } = useAppSelector((state) => state.cliente);

    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clienteToEdit, setClienteToEdit] = useState<Cliente | null>(null);
    const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);

    useEffect(() => {
        loadClientes();
    }, []);

    const loadClientes = async () => {
        try {
            dispatch(fetchStart());
            const data = await clienteService.getAll();
            dispatch(fetchSuccess(data));
        } catch (err) {
            dispatch(fetchFailure(err instanceof Error ? err.message : 'Error al cargar clientes'));
        }
    };

    const handleEdit = (cliente: Cliente) => {
        setClienteToEdit(cliente);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (cliente: Cliente) => {
        setClienteToDelete(cliente);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!clienteToDelete) return;

        try {
            await clienteService.delete(clienteToDelete._id);
            dispatch(removeCliente(clienteToDelete._id));
            setClienteToDelete(null);
        } catch (err) {
            console.error('Error al eliminar cliente:', err);
            alert('Error al eliminar el cliente');
        }
    };

    const filteredClientes = clientes.filter((cliente) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            cliente.nombre.toLowerCase().includes(searchLower) ||
            cliente.apellido.toLowerCase().includes(searchLower) ||
            cliente.dni.includes(searchTerm) ||
            cliente.email.toLowerCase().includes(searchLower)
        );
    });

    const columns = [
        {
            key: 'nombre',
            title: 'Nombre',
            render: (_: string, cliente: Cliente) => `${cliente.nombre} ${cliente.apellido}`,
        },
        {
            key: 'dni',
            title: 'DNI',
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
            render: (_: unknown, cliente: Cliente) => (
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(cliente);
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                        title="Editar"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(cliente);
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
                        <h1 className="text-3xl font-bold text-white mb-2">Clientes</h1>
                        <p className="text-slate-400">Gestión de clientes del sistema</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <UserPlus size={20} />
                        Nuevo Cliente
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
                            placeholder="Buscar por nombre, DNI o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                <Table
                    data={filteredClientes}
                    columns={columns}
                    keyExtractor={(cliente) => cliente._id}
                    loading={loading}
                    emptyMessage="No se encontraron clientes"
                />

                {/* Create Modal */}
                {isCreateModalOpen && (
                    <ClienteForm
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        onSuccess={(newCliente: Cliente) => {
                            dispatch(addCliente(newCliente));
                            setIsCreateModalOpen(false);
                        }}
                    />
                )}

                {/* Edit Modal */}
                {isEditModalOpen && clienteToEdit && (
                    <ClienteForm
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setClienteToEdit(null);
                        }}
                        initialData={clienteToEdit}
                        onSuccess={(updatedCliente: Cliente) => {
                            dispatch(updateCliente(updatedCliente));
                            setIsEditModalOpen(false);
                            setClienteToEdit(null);
                        }}
                    />
                )}

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setClienteToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Eliminar Cliente"
                    message={`¿Está seguro que desea eliminar al cliente ${clienteToDelete?.nombre} ${clienteToDelete?.apellido}? Esta acción no se puede deshacer.`}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                    variant="danger"
                />
            </div>
        </DashboardLayout>
    );
}

export default Clientes;
