import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components';
import { Table } from '../components/ui/Table';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { Plus, Edit, CheckCircle, XCircle } from 'lucide-react';
import { tareaService } from '../services/tareaService';
import type { Tarea } from '../services/tareaService';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

// Define el esquema de validación para las tareas usando Joi
const tareaSchema = Joi.object({
  descripcion: Joi.string().required().messages({
    'string.empty': 'La descripción es requerida',
    'any.required': 'La descripción es requerida'
  }),
  precio: Joi.number().min(0.01).required().messages({
    'number.base': 'El precio debe ser un número',
    'number.min': 'El precio debe ser mayor a 0',
    'any.required': 'El precio es requerido'
  }),
  tiempo_estimado: Joi.number().integer().min(1).required().messages({
    'number.base': 'El tiempo estimado debe ser un número',
    'number.min': 'El tiempo estimado debe ser al menos 1 minuto',
    'any.required': 'El tiempo estimado es requerido'
  }),
});

interface TareaFormData {
  descripcion: string;
  precio: number;
  tiempo_estimado: number;
}

export function Servicios() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedTarea, setSelectedTarea] = useState<Tarea | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TareaFormData>({
    resolver: joiResolver(tareaSchema),
  });

  const fetchTareas = async () => {
    setLoading(true);
    try {
      const data = await tareaService.getAll();
      setTareas(data);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTareas();
  }, []);

  const handleCreateClick = () => {
    setSelectedTarea(null);
    reset({ descripcion: '', precio: 0, tiempo_estimado: 0 });
    setIsModalOpen(true);
  };

  const handleEditClick = (tarea: Tarea) => {
    setSelectedTarea(tarea);
    setValue('descripcion', tarea.descripcion);
    setValue('precio', tarea.precio);
    setValue('tiempo_estimado', tarea.tiempo_estimado);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (tarea: Tarea) => {
    setSelectedTarea(tarea);
    setIsConfirmModalOpen(true);
  };

  const handleFormSubmit = async (data: TareaFormData) => {
    try {
      if (selectedTarea) {
        // Editar tarea
        await tareaService.update(selectedTarea._id, data);
      } else {
        // Crear tarea
        await tareaService.create(data);
      }
      setIsModalOpen(false);
      fetchTareas();
    } catch (error) {
      console.error('Error al guardar la tarea:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedTarea) {
      try {
        await tareaService.softDelete(selectedTarea._id);
        fetchTareas();
      } catch (error) {
        console.error('Error al eliminar la tarea:', error);
      } finally {
        setIsConfirmModalOpen(false);
        setSelectedTarea(null);
      }
    }
  };

  const columns = [
    { key: 'descripcion', title: 'Descripción' },
    { key: 'precio', title: 'Precio', render: (value: number) => `$${value.toFixed(2)}` },
    { key: 'tiempo_estimado', title: 'Tiempo Estimado', render: (value: number) => `${value} min` },
    { key: 'isActive', title: 'Activa', render: (value: boolean) => (value ? 'Sí' : 'No') },
    {
      key: 'actions',
      title: 'Acciones',
      render: (_: any, tarea: Tarea) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(tarea);
            }}
            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
            title="Editar"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(tarea);
            }}
            className={`p-2 rounded transition-colors ${
              tarea.isActive 
                ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' 
                : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
            }`}
            title={tarea.isActive ? 'Desactivar servicio' : 'Activar servicio'}
          >
            {tarea.isActive ? (
              <XCircle size={18} />
            ) : (
              <CheckCircle size={18} />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Gestión de Servicios</h1>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Crear Servicio</span>
          </button>
        </div>

        <Table
          data={tareas}
          columns={columns}
          keyExtractor={(item) => item._id}
          loading={loading}
          emptyMessage="No hay servicios disponibles."
        />
      </div>

      {/* Modal de Creación/Edición */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTarea ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              type="text"
              {...register('descripcion')}
              className={errors.descripcion ? 'border-red-500' : ''}
            />
            {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>}
          </div>
          <div>
            <Label htmlFor="precio">Precio</Label>
            <Input
              id="precio"
              type="number"
              step="0.01"
              {...register('precio', { valueAsNumber: true })}
              className={errors.precio ? 'border-red-500' : ''}
            />
            {errors.precio && <p className="text-red-500 text-sm mt-1">{errors.precio.message}</p>}
          </div>
          <div>
            <Label htmlFor="tiempo_estimado">Tiempo Estimado (minutos)</Label>
            <Input
              id="tiempo_estimado"
              type="number"
              step="1"
              {...register('tiempo_estimado', { valueAsNumber: true })}
              className={errors.tiempo_estimado ? 'border-red-500' : ''}
            />
            {errors.tiempo_estimado && <p className="text-red-500 text-sm mt-1">{errors.tiempo_estimado.message}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {selectedTarea ? 'Guardar Cambios' : 'Crear Servicio'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Confirmación de Activar/Desactivar */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={selectedTarea?.isActive ? "Confirmar Desactivación" : "Confirmar Activación"}
        message={
          selectedTarea?.isActive
            ? `¿Estás seguro de que quieres desactivar el servicio "${selectedTarea?.descripcion}"? No será visible para los clientes.`
            : `¿Estás seguro de que quieres activar el servicio "${selectedTarea?.descripcion}"? Será visible para los clientes.`
        }
        confirmText={selectedTarea?.isActive ? "Desactivar" : "Activar"}
        variant={selectedTarea?.isActive ? "danger" : "info"}
      />
    </DashboardLayout>
  );
}
