import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal'; 
import { proveedorService } from '../../services/proveedorService';
import type { Proveedor, CreateProveedorRequest } from '../../types/proveedor.types';

interface ProveedorFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (proveedor: Proveedor) => void;
    initialData?: Proveedor | null;
}

export function ProveedorForm({ isOpen, onClose, onSuccess, initialData }: ProveedorFormProps) {
    const [formData, setFormData] = useState<CreateProveedorRequest>({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        telefono: '',
        direccion: '',
        cuit: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre,
                apellido: initialData.apellido,
                dni: initialData.dni,
                email: initialData.email,
                telefono: initialData.telefono || '',
                direccion: initialData.direccion || '',
                cuit: initialData.cuit || '',
            });
        } else {
            setFormData({
                nombre: '',
                apellido: '',
                dni: '',
                email: '',
                telefono: '',
                direccion: '',
                cuit: '',
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }
        if (!formData.apellido.trim()) {
            newErrors.apellido = 'El apellido es requerido';
        }
        if (!formData.dni.trim()) {
            newErrors.dni = 'El DNI es requerido';
        } else if (!/^\d{7,8}$/.test(formData.dni)) {
            newErrors.dni = 'El DNI debe tener 7 u 8 dígitos';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }
        if (formData.cuit && !/^\d{11}$/.test(formData.cuit.replace(/-/g, ''))) {
            newErrors.cuit = 'El CUIT debe tener 11 dígitos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            let proveedor: Proveedor;
            if (initialData) {
                // Update existing proveedor
                proveedor = await proveedorService.update(initialData._id, formData);
            } else {
                // Create new proveedor
                proveedor = await proveedorService.create(formData);
            }
            onSuccess(proveedor);
            onClose(); // Cerramos el modal automáticamente al tener éxito
        } catch (err) {
            console.error('Error al guardar proveedor:', err);
            setErrors({ submit: 'Error al guardar el proveedor. Intente nuevamente.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
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
            title={initialData ? 'Editar Proveedor' : 'Nuevo Proveedor'}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-slate-300 mb-1">
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 bg-slate-700 border ${errors.nombre ? 'border-red-500' : 'border-slate-600'
                                } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors`}
                            placeholder="Nombre del proveedor"
                        />
                        {errors.nombre && <p className="text-red-400 text-sm mt-1">{errors.nombre}</p>}
                    </div>

                    <div>
                        <label htmlFor="apellido" className="block text-sm font-medium text-slate-300 mb-1">
                            Apellido <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="apellido"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 bg-slate-700 border ${errors.apellido ? 'border-red-500' : 'border-slate-600'
                                } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors`}
                            placeholder="Apellido"
                        />
                        {errors.apellido && <p className="text-red-400 text-sm mt-1">{errors.apellido}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="dni" className="block text-sm font-medium text-slate-300 mb-1">
                            DNI <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="dni"
                            name="dni"
                            value={formData.dni}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 bg-slate-700 border ${errors.dni ? 'border-red-500' : 'border-slate-600'
                                } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors`}
                            placeholder="12345678"
                            maxLength={8}
                        />
                        {errors.dni && <p className="text-red-400 text-sm mt-1">{errors.dni}</p>}
                    </div>

                    <div>
                        <label htmlFor="cuit" className="block text-sm font-medium text-slate-300 mb-1">
                            CUIT
                        </label>
                        <input
                            type="text"
                            id="cuit"
                            name="cuit"
                            value={formData.cuit}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 bg-slate-700 border ${errors.cuit ? 'border-red-500' : 'border-slate-600'
                                } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors`}
                            placeholder="20-12345678-9"
                        />
                        {errors.cuit && <p className="text-red-400 text-sm mt-1">{errors.cuit}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 bg-slate-700 border ${errors.email ? 'border-red-500' : 'border-slate-600'
                            } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors`}
                        placeholder="contacto@proveedor.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-slate-300 mb-1">
                        Teléfono
                    </label>
                    <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="+54 9 11 1234-5678"
                    />
                </div>

                <div>
                    <label htmlFor="direccion" className="block text-sm font-medium text-slate-300 mb-1">
                        Dirección
                    </label>
                    <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Calle 123, Ciudad"
                    />
                </div>
            </form>
        </Modal>
    );
}

export default ProveedorForm;