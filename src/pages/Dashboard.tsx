import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { DashboardLayout } from '../components';
import { StatsCard } from '../components/ui/Card';
import { Users, Wrench, Package, AlertTriangle } from 'lucide-react';
import { personaService, trabajoService, productoService } from '../services';

function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalClientes: 0,
    trabajosPendientes: 0,
    productosStockBajo: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [clientes, trabajos, productos] = await Promise.all([
          personaService.getByTipo('Cliente').catch(() => []),
          trabajoService.getByEstado('Pendiente').catch(() => []),
          productoService.getLowStock().catch(() => []),
        ]);

        setMetrics({
          totalClientes: clientes.length,
          trabajosPendientes: trabajos.length,
          productosStockBajo: productos.length,
          loading: false,
        });
      } catch (error) {
        console.error('Error al cargar métricas:', error);
        setMetrics((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchMetrics();
  }, []);

  const StockIcon = metrics.productosStockBajo > 0 
    ? <AlertTriangle className="text-red-500" size={24} />
    : <Package className="text-green-500" size={24} />;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Vista general del estado del negocio</p>
        </div>

        {/* Grid de Tarjetas con Navegación */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/dashboard/clientes" className="block transition-transform hover:scale-105">
            <StatsCard
              title="Total Clientes"
              value={metrics.loading ? '...' : metrics.totalClientes}
              icon={<Users className="text-blue-500" size={24} />}
            />
          </Link>

          <Link to="/dashboard/trabajos" className="block transition-transform hover:scale-105">
            <StatsCard
              title="Trabajos Pendientes"
              value={metrics.loading ? '...' : metrics.trabajosPendientes}
              icon={<Wrench className="text-yellow-500" size={24} />}
            />
          </Link>

          <Link to="/dashboard/productos" className="block transition-transform hover:scale-105">
            <StatsCard
              title="Productos Stock Bajo"
              value={metrics.loading ? '...' : metrics.productosStockBajo}
              icon={StockIcon}
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Actividad Reciente */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Actividad Reciente</h3>
            <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
              No hay actividad reciente
            </div>
          </div>

          {/* Alertas */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg borderkz border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Alertas del Sistema</h3>
            {metrics.loading ? (
              <div className="text-slate-500 text-sm text-center py-8">Cargando alertas...</div>
            ) : metrics.productosStockBajo > 0 ? (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-red-400 font-medium">Atención requerida</p>
                    <p className="text-slate-300 text-sm mt-1">
                      Hay <strong>{metrics.productosStockBajo}</strong> producto(s) por debajo del stock mínimo.
                    </p>
                    <Link to="/dashboard/productos" className="text-xs text-red-400 hover:text-red-300 underline mt-2 inline-block transition-transform hover:scale-105">
                      Ver inventario &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-slate-500">
                 <Package className="text-slate-600 mb-2" size={32} />
                 <span className="text-sm">Todo en orden</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;