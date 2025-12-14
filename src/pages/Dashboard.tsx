import { useEffect, useState } from 'react';
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">
            Vista general del estado del negocio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Total Clientes"
            value={metrics.loading ? '...' : metrics.totalClientes}
            icon={<Users className="text-blue-500" size={24} />}
          />

          <StatsCard
            title="Trabajos Pendientes"
            value={metrics.loading ? '...' : metrics.trabajosPendientes}
            icon={<Wrench className="text-yellow-500" size={24} />}
          />

          <StatsCard
            title="Productos Stock Bajo"
            value={metrics.loading ? '...' : metrics.productosStockBajo}
            icon={
              metrics.productosStockBajo > 0 ? (
                <AlertTriangle className="text-red-500" size={24} />
              ) : (
                <Package className="text-green-500" size={24} />
              )
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Actividad Reciente</h3>
            <div className="text-slate-400 text-sm text-center py-8">
              No hay actividad reciente para mostrar
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Alertas</h3>
            {metrics.productosStockBajo > 0 ? (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-red-400 font-medium">Stock bajo</p>
                    <p className="text-slate-400 text-sm mt-1">
                      {metrics.productosStockBajo} producto{metrics.productosStockBajo !== 1 ? 's' : ''} necesita{metrics.productosStockBajo === 1 ? '' : 'n'} reabastecimiento
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-sm text-center py-8">
                No hay alertas en este momento
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
