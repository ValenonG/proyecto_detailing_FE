import { Link } from 'react-router-dom';
import { Car, Sparkles, Shield, Clock, DollarSign, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { tareaService, type Tarea } from '../services';

function Home() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        setLoading(true);
        const data = await tareaService.getAll();
        setTareas(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar servicios:', err);
        setError('No se pudieron cargar los servicios');
      } finally {
        setLoading(false);
      }
    };

    fetchTareas();
  }, []);

  const getIconForService = (index: number) => {
    const icons = [Sparkles, Shield, Car, Clock];
    const Icon = icons[index % icons.length];
    return <Icon className="text-blue-500 mb-4" size={40} />;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Car className="text-blue-500" size={32} />
              <h1 className="text-2xl font-bold">Auto Detailing</h1>
            </div>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white transition-colors px-4 py-2"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Servicios de Detailing Profesional
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Cuidamos tu vehículo con los mejores productos y técnicas del mercado.
              Lavado, pulido, cerámico y mucho más.
            </p>
            <Link
              to="/register"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg transition-colors"
            >
              Solicita tu Turno
            </Link>
          </div>
        </section>

        <section className="bg-slate-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h3>

            {loading && (
              <div className="text-center text-slate-400 py-8">
                Cargando servicios...
              </div>
            )}

            {error && (
              <div className="text-center text-red-400 py-8 bg-red-500/10 rounded-lg">
                {error}
              </div>
            )}

            {!loading && !error && tareas.length === 0 && (
              <div className="text-center text-slate-400 py-8">
                No hay servicios disponibles en este momento.
              </div>
            )}

            {!loading && !error && Array.isArray(tareas) && tareas.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tareas.map((tarea, index) => (
                  <div key={tarea._id} className="bg-slate-700 p-6 rounded-lg hover:bg-slate-600 transition-colors">
                    {getIconForService(index)}
                    <h4 className="text-xl font-semibold mb-3">{tarea.descripcion}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                        <DollarSign size={16} className="text-green-400" />
                        <span className="font-medium">${tarea.precio.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Timer size={16} className="text-blue-400" />
                        <span>{tarea.tiempo_estimado} minutos</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-blue-600 rounded-lg p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">¿Listo para cuidar tu auto?</h3>
            <p className="text-lg mb-6">
              Regístrate ahora y agenda tu primer servicio
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-blue-600 hover:bg-slate-100 font-semibold px-8 py-3 rounded-lg text-lg transition-colors"
            >
              Comenzar Ahora
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-slate-800 border-t border-slate-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <p>© 2025 Auto Detailing. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
