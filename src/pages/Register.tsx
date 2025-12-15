import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { useNavigate, Link } from 'react-router-dom';
import { registerSchema } from '../validations/auth.validation';
import type { RegisterRequest } from '../types/auth.types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerStart, registerSuccess, registerFailure } from '../store/slices/authSlice';
import authService from '../services/authService';
import { useState } from 'react';
import { User, Mail, Lock, Phone, MapPin, FileText, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

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

      await authService.register(data);

      const loginResponse = await authService.login({
        email: data.email,
        password: data.password,
      });

      authService.saveToken(loginResponse.idToken);

      localStorage.setItem('user', JSON.stringify(loginResponse.persona));

      dispatch(registerSuccess({
        user: loginResponse.persona,
        token: loginResponse.idToken,
      }));
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al registrarse';
      setBackendError(errorMessage);
      dispatch(registerFailure(errorMessage));
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-hidden font-sans py-10 px-4">
      
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop" 
          alt="Background" 
          className="w-full h-full object-cover opacity-40 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/80" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        
        <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-6 group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </Link>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Crear Cuenta</h1>
            <p className="text-slate-400 mt-2 text-sm">Únete a nosotros para gestionar tus servicios</p>
          </div>

          {(error || backendError) && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-start gap-3 text-sm animate-fadeIn">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{backendError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wide">Nombre *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    {...register('nombre')}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-white placeholder-slate-600 transition-all"
                    
                  />
                </div>
                {errors.nombre && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.nombre.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wide">Apellido *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    {...register('apellido')}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-white placeholder-slate-600 transition-all"
                    
                  />
                </div>
                {errors.apellido && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.apellido.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wide">DNI *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <FileText size={18} />
                  </div>
                  <input
                    type="text"
                    {...register('dni')}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-white placeholder-slate-600 transition-all"
                    
                  />
                </div>
                {errors.dni && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.dni.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wide">Teléfono</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="text"
                    {...register('telefono')}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-white placeholder-slate-600 transition-all"
                  />
                </div>
                {errors.telefono && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.telefono.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wide">Email *</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-white placeholder-slate-600 transition-all"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wide">Contraseña *</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-white placeholder-slate-600 transition-all"
                  
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wide">Dirección</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <MapPin size={18} />
                </div>
                <input
                  type="text"
                  {...register('direccion')}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-white placeholder-slate-600 transition-all"
                />
              </div>
              {errors.direccion && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.direccion.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Registrando...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <p className="text-slate-400 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-all">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;