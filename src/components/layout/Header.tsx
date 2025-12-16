import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { LogOut, User, Bell } from 'lucide-react';

export function Header() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    // Usar window.location para forzar recarga completa y evitar race conditions
    window.location.href = '/';
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 h-17">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-white">Panel de Administración</h2>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {user && (
            <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-700 rounded-lg">
              <div className="flex items-center gap-2 text-slate-300">
                <div className="bg-blue-600 rounded-full p-1.5">
                  <User size={16} className="text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-white">{user.nombre} {user.apellido}</p>
                  <p className="text-xs text-slate-400">{user.tipo}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium cursor-pointer"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
