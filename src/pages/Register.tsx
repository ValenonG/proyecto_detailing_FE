import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { useNavigate, Link } from 'react-router-dom';
import { registerSchema } from '../validations/auth.validation';
import type { RegisterRequest } from '../types/auth.types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerStart, registerSuccess, registerFailure } from '../store/slices/authSlice';
import authService from '../services/authService';
import { useState } from 'react';

function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [backendError, setBackendError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: joiResolver(registerSchema),
    defaultValues: {
      tipo: 'Cliente',
    },
  });

  const onSubmit = async (data: RegisterRequest) => {
    try {
      setBackendError(null);
      dispatch(registerStart());

      const response = await authService.register(data);

      dispatch(registerSuccess({
        user: response.persona,
        token: response.firebaseUser.uid,
      }));

      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al registrarse';
      setBackendError(errorMessage);
      dispatch(registerFailure(errorMessage));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-2xl my-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Crear Cuenta</h1>

        {(error || backendError) && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {backendError || error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium mb-2">
                Nombre *
              </label>
              <input
                id="nombre"
                type="text"
                {...register('nombre')}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="Juan"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="apellido" className="block text-sm font-medium mb-2">
                Apellido *
              </label>
              <input
                id="apellido"
                type="text"
                {...register('apellido')}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="Pérez"
              />
              {errors.apellido && (
                <p className="text-red-500 text-sm mt-1">{errors.apellido.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dni" className="block text-sm font-medium mb-2">
                DNI *
              </label>
              <input
                id="dni"
                type="text"
                {...register('dni')}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="12345678"
              />
              {errors.dni && (
                <p className="text-red-500 text-sm mt-1">{errors.dni.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium mb-2">
                Teléfono
              </label>
              <input
                id="telefono"
                type="text"
                {...register('telefono')}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="1123456789"
              />
              {errors.telefono && (
                <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email *
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Contraseña *
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="direccion" className="block text-sm font-medium mb-2">
              Dirección
            </label>
            <input
              id="direccion"
              type="text"
              {...register('direccion')}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Calle 123"
            />
            {errors.direccion && (
              <p className="text-red-500 text-sm mt-1">{errors.direccion.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-400">
              Inicia sesión aquí
            </Link>
          </p>
          <Link to="/" className="text-slate-400 hover:text-slate-300 text-sm mt-4 block">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
