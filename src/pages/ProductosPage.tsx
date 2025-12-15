import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchProductos,
    deleteProducto,
    setSearchTerm,
    setFilterLowStock,
} from '../store/slices/productosSlice';
import { ProductoForm } from '../components/productos';
import { DashboardLayout } from '../components';
import { Search, Plus, Edit, Trash2, AlertTriangle, Package, AlertCircle } from 'lucide-react';

function ProductosPage() {
    const dispatch = useAppDispatch();
    const { productos, loading, searchTerm, filterLowStock } = useAppSelector((state) => state.productos);
    const [showForm, setShowForm] = useState(false);
    const [editingProducto, setEditingProducto] = useState<typeof productos[0] | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; producto: typeof productos[0] | null }>({
        show: false,
        producto: null
    });

    useEffect(() => {
        dispatch(fetchProductos());
    }, [dispatch]);

    const handleEdit = (producto: typeof productos[0]) => {
        setEditingProducto(producto);
        setShowForm(true);
    };

    const handleDelete = async () => {
        if (confirmDelete.producto) {
            await dispatch(deleteProducto(confirmDelete.producto._id));
            setConfirmDelete({ show: false, producto: null });
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingProducto(null);
    };

    // Filtrar productos
    const filteredProductos = (productos || [])
        .filter((p) => {
            // Filtro de búsqueda
            const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());

            // Filtro de stock bajo
            const matchesLowStock = !filterLowStock || p.stock_actual < p.stock_minimo;

            return matchesSearch && matchesLowStock;
        });

    const lowStockCount = (productos || []).filter(p => p.stock_actual < p.stock_minimo).length;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Package className="text-blue-500" size={32} />
                            Gestión de Inventario
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Administra productos e insumos del taller
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus size={20} />
                        Nuevo Producto
                    </button>
                </div>

                {/* Alertas de Stock Bajo */}
                {lowStockCount > 0 && (
                    <div className="mb-6 bg-red-500/10 border border-red-500 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
                            <div>
                                <h3 className="text-red-400 font-semibold">
                                    ¡Atención! {lowStockCount} {lowStockCount === 1 ? 'producto' : 'productos'} con stock bajo
                                </h3>
                                <p className="text-red-300 text-sm">
                                    Hay productos con stock actual menor al stock mínimo configurado
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters and Search */}
                <div className="bg-slate-800 rounded-lg p-4 mb-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={searchTerm}
                                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Filtro Stock Bajo */}
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filterLowStock}
                                    onChange={(e) => dispatch(setFilterLowStock(e.target.checked))}
                                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                                />
                                <AlertTriangle size={18} className="text-red-500" />
                                <span>Solo stock bajo</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">
                            Cargando productos...
                        </div>
                    ) : filteredProductos.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            No se encontraron productos
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                            Producto
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                            Proveedor
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                                            Precio Venta
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {filteredProductos.map((producto) => {
                                        const isLowStock = producto.stock_actual < producto.stock_minimo;
                                        const proveedor = typeof producto.proveedor === 'object' ? producto.proveedor : null;

                                        return (
                                            <tr
                                                key={producto._id}
                                                className={`hover:bg-slate-700/50 transition-colors ${isLowStock ? 'bg-red-500/5' : ''
                                                    }`}
                                            >
                                                <td className="px-4 py-3 text-white">
                                                    <div className="flex items-center gap-2">
                                                        {isLowStock && (
                                                            <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
                                                        )}
                                                        <span className="font-medium">{producto.nombre}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-300">
                                                    {proveedor ? `${proveedor.nombre} ${proveedor.apellido}` : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-center text-green-400 font-semibold">
                                                    ${producto.precio_venta.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className={`font-semibold ${isLowStock ? 'text-red-400' : 'text-blue-400'
                                                            }`}>
                                                            {producto.stock_actual}
                                                        </span>
                                                        <span className="text-xs text-slate-400">
                                                            Mín: {producto.stock_minimo}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {isLowStock ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500">
                                                            <AlertCircle size={14} />
                                                            Stock Bajo
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500">
                                                            ✓ Normal
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(producto)}
                                                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmDelete({ show: true, producto })}
                                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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

                {/* Stats */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Total Productos</p>
                                <p className="text-2xl font-bold text-white">{(productos || []).length}</p>
                            </div>
                            <Package className="text-blue-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Stock Bajo</p>
                                <p className="text-2xl font-bold text-red-400">{lowStockCount}</p>
                            </div>
                            <AlertTriangle className="text-red-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Stock Normal</p>
                                <p className="text-2xl font-bold text-green-400">
                                    {(productos || []).length - lowStockCount}
                                </p>
                            </div>
                            <div className="text-green-500 text-3xl font-bold">✓</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <ProductoForm
                    producto={editingProducto}
                    onClose={handleCloseForm}
                />
            )}

            {/* Delete Confirmation Modal */}
            {confirmDelete.show && confirmDelete.producto && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
                    <div className="bg-slate-800 rounded-lg max-w-md w-full mx-4 shadow-2xl border border-slate-700">
                        <div className="p-4 border-b border-slate-700 flex items-center gap-3 bg-red-500/10">
                            <AlertTriangle size={24} className="text-red-500 flex-shrink-0" />
                            <h3 className="font-bold text-white text-lg">Confirmar Eliminación</h3>
                        </div>

                        <div className="p-6">
                            <p className="text-slate-300">
                                ¿Estás seguro que deseas eliminar el producto{' '}
                                <span className="font-bold text-white">{confirmDelete.producto.nombre}</span>?
                            </p>
                            <p className="text-slate-400 text-sm mt-2">
                                Esta acción no se puede deshacer.
                            </p>
                        </div>

                        <div className="p-4 border-t border-slate-700 flex justify-end gap-2">
                            <button
                                onClick={() => setConfirmDelete({ show: false, producto: null })}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default ProductosPage;