import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { useNavigate, Link } from 'react-router-dom';
import { loginSchema } from '../validations/auth.validation';
import { LoginRequest } from '../types/auth.types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import authService from '../services/authService';
import { useState } from 'react';

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [backendError, setBackendError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: joiResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      setBackendError(null);
      dispatch(loginStart());

      const response = await authService.login(data);

      dispatch(loginSuccess({
        user: response.persona,
        token: response.idToken,
      }));

      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
      setBackendError(errorMessage);
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Iniciar Sesión</h1>

        {(error || backendError) && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {backendError || error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
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
              Contraseña
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-400">
              Regístrate aquí
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

export default Login;
