import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { LogOut, User } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2 text-slate-300">
                  <User size={20} />
                  <span>{user.nombre} {user.apellido}</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-sm text-slate-400">{user.tipo}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Bienvenido al Panel de Administración</h2>
          <p className="text-slate-400 mb-4">
            Estás autenticado correctamente. Aquí podrás gestionar clientes, vehículos, trabajos y más.
          </p>

          {user && (
            <div className="bg-slate-700 rounded-lg p-4 mt-6">
              <h3 className="text-lg font-semibold mb-3">Información del Usuario</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-400">Nombre:</span>{' '}
                  <span className="font-medium">{user.nombre} {user.apellido}</span>
                </div>
                <div>
                  <span className="text-slate-400">Email:</span>{' '}
                  <span className="font-medium">{user.email}</span>
                </div>
                <div>
                  <span className="text-slate-400">DNI:</span>{' '}
                  <span className="font-medium">{user.dni}</span>
                </div>
                <div>
                  <span className="text-slate-400">Rol:</span>{' '}
                  <span className="font-medium">{user.tipo}</span>
                </div>
                {user.telefono && (
                  <div>
                    <span className="text-slate-400">Teléfono:</span>{' '}
                    <span className="font-medium">{user.telefono}</span>
                  </div>
                )}
                {user.direccion && (
                  <div>
                    <span className="text-slate-400">Dirección:</span>{' '}
                    <span className="font-medium">{user.direccion}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-500/10 border border-blue-500 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Próximos pasos</h3>
          <p className="text-slate-300">
            El CRUD completo para clientes, vehículos, trabajos, productos y servicios se implementará aquí.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
