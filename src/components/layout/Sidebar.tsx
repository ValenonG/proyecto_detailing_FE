import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  Package,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAppSelector } from '../../store/hooks';
import type { UserRole } from '../../types/auth.types';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  badge?: number;
  allowedRoles?: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/dashboard',
    allowedRoles: ['Cliente', 'Empleado', 'Administrador', 'Proveedor']
  },
  {
    icon: Users,
    label: 'Clientes',
    path: '/dashboard/clientes',
    allowedRoles: ['Empleado', 'Administrador']
  },
  {
    icon: Car,
    label: 'Vehículos',
    path: '/dashboard/vehiculos',
    allowedRoles: ['Empleado', 'Administrador']
  },
  {
    icon: Wrench,
    label: 'Trabajos',
    path: '/dashboard/trabajos',
    allowedRoles: ['Empleado', 'Administrador']
  },
  {
    icon: Package,
    label: 'Productos',
    path: '/dashboard/productos',
    allowedRoles: ['Empleado', 'Administrador']
  },
  {
    icon: FileText,
    label: 'Servicios',
    path: '/dashboard/servicios',
    allowedRoles: ['Empleado', 'Administrador']
  },
  {
    icon: Settings,
    label: 'Configuración',
    path: '/dashboard/config',
    allowedRoles: ['Administrador']
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  // Filter menu items based on user role
  const visibleMenuItems = useMemo(() => {
    if (!user) return [];
    return menuItems.filter(item =>
      !item.allowedRoles || item.allowedRoles.includes(user.tipo)
    );
  }, [user]);

  return (
    <aside
      className={`bg-slate-800 border-r border-slate-700 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Car className="text-blue-500" size={28} />
              <h1 className="text-lg font-bold text-white">Auto Detailing</h1>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto">
              <Car className="text-blue-500" size={28} />
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute right-0 top-20 transform translate-x-1/2 bg-slate-700 hover:bg-slate-600 text-white rounded-full p-1.5 transition-colors z-10"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/dashboard'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      } ${isCollapsed ? 'justify-center' : ''}`
                    }
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon size={20} />
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                    {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
          {!isCollapsed ? (
            <div className="text-xs text-slate-400 text-center">
              <p>© 2025 Auto Detailing</p>
            </div>
          ) : (
            <div className="h-4"></div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
