import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { vehiculoService, clienteService } from '../../services';
import type { Vehiculo, CreateVehiculoRequest } from '../../types/vehiculo.types';
import type { Cliente } from '../../types/cliente.types';

interface VehiculoFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (vehiculo: Vehiculo) => void;
    initialData?: Vehiculo | null;
}

export function VehiculoForm({ isOpen, onClose, onSuccess, initialData }: VehiculoFormProps) {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loadingClientes, setLoadingClientes] = useState(true);

    const [formData, setFormData] = useState<CreateVehiculoRequest>({
        cliente: '',
        marca: '',
        modelo: '',
        patente: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cargar lista de clientes
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                setLoadingClientes(true);
                const data = await clienteService.getAll();
                setClientes(data);
            } catch (err) {
                console.error('Error al cargar clientes:', err);
            } finally {
                setLoadingClientes(false);
            }
        };

        if (isOpen) {
            fetchClientes();
        }
    }, [isOpen]);

    // Inicializar formulario
    useEffect(() => {
        if (initialData) {
            setFormData({
                cliente: initialData.cliente,
                marca: initialData.marca,
                modelo: initialData.modelo,
                patente: initialData.patente || '',
            });
        } else {
            setFormData({
                cliente: '',
                marca: '',
                modelo: '',
                patente: '',
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.cliente) {
            newErrors.cliente = 'Debe seleccionar un cliente';
        }
        if (!formData.marca.trim()) {
            newErrors.marca = 'La marca es requerida';
        }
        if (!formData.modelo.trim()) {
            newErrors.modelo = 'El modelo es requerido';
        }
        // Patente es opcional, pero si se ingresa, validar formato
        if (formData.patente && formData.patente.trim() &&
            !/^[A-Z]{3}\d{3}$|^[A-Z]{2}\d{3}[A-Z]{2}$/.test(formData.patente.toUpperCase())) {
            newErrors.patente = 'Formato de patente inválido (ej: ABC123 o AB123CD)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            // Preparar datos - eliminar patente si está vacía
            const dataToSend = {
                ...formData,
                patente: formData.patente?.trim() || undefined,
            };

            let vehiculo: Vehiculo;
            if (initialData) {
                // Update existing vehiculo
                vehiculo = await vehiculoService.update(initialData._id, dataToSend);
            } else {
                // Create new vehiculo
                vehiculo = await vehiculoService.create(dataToSend);
            }
            onSuccess(vehiculo);
        } catch (err) {
            console.error('Error al guardar vehículo:', err);
            setErrors({ submit: 'Error al guardar el vehículo. Intente nuevamente.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Editar Vehículo' : 'Nuevo Vehículo'}
            footer={
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.submit && (
                    <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                        <p className="text-red-400 text-sm">{errors.submit}</p>
                    </div>
                )}

                <div>
                    <label htmlFor="cliente" className="block text-sm font-medium text-slate-300 mb-1">
                        Cliente Propietario <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="cliente"
                        name="cliente"
                        value={formData.cliente}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 bg-slate-700 border ${errors.cliente ? 'border-red-500' : 'border-slate-600'
                            } rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors`}
                        disabled={loadingClientes}
                    >
                        <option value="">
                            {loadingClientes ? 'Cargando clientes...' : 'Seleccione un cliente'}
                        </option>
                        {clientes.map((cliente) => (
                            <option key={cliente._id} value={cliente._id}>
                                {cliente.nombre} {cliente.apellido} - {cliente.dni}
                            </option>
                        ))}
                    </select>
                    {errors.cliente && <p className="text-red-400 text-sm mt-1">{errors.cliente}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="marca" className="block text-sm font-medium text-slate-300 mb-1">
                            Marca <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="marca"
                            name="marca"
                            value={formData.marca}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 bg-slate-700 border ${errors.marca ? 'border-red-500' : 'border-slate-600'
                                } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors`}
                            placeholder="Toyota"
                        />
                        {errors.marca && <p className="text-red-400 text-sm mt-1">{errors.marca}</p>}
                    </div>

                    <div>
                        <label htmlFor="modelo" className="block text-sm font-medium text-slate-300 mb-1">
                            Modelo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="modelo"
                            name="modelo"
                            value={formData.modelo}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 bg-slate-700 border ${errors.modelo ? 'border-red-500' : 'border-slate-600'
                                } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors`}
                            placeholder="Corolla"
                        />
                        {errors.modelo && <p className="text-red-400 text-sm mt-1">{errors.modelo}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="patente" className="block text-sm font-medium text-slate-300 mb-1">
                        Patente <span className="text-slate-400">(opcional)</span>
                    </label>
                    <input
                        type="text"
                        id="patente"
                        name="patente"
                        value={formData.patente}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 bg-slate-700 border ${errors.patente ? 'border-red-500' : 'border-slate-600'
                            } rounded-lg text-white placeholder-slate-400 uppercase focus:outline-none focus:border-blue-500 transition-colors`}
                        placeholder="ABC123 o AB123CD"
                        maxLength={7}
                    />
                    {errors.patente && <p className="text-red-400 text-sm mt-1">{errors.patente}</p>}
                </div>
            </form>
        </Modal>
    );
}

export default VehiculoForm;
