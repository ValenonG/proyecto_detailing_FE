import { Link } from 'react-router-dom';
import { Car, Sparkles, Shield, Clock, DollarSign, Timer, ChevronRight, Star, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { tareaService, type Tarea } from '../services';
import Mapa from '../components/ui/Mapa';

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

const handleScrollToServices = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  const element = document.getElementById('servicios');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

  const getIconForService = (index: number) => {
    const icons = [Sparkles, Shield, Car, Star];
    const Icon = icons[index % icons.length];
    return <Icon className="text-blue-400 group-hover:text-white transition-colors duration-300" size={32} />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500 selection:text-white">
      
      <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">FUTURA <span className="text-blue-400">DETAILING</span></h1>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/login" className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="bg-white text-slate-900 hover:bg-blue-50 px-5 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-900/20"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop" 
              alt="Luxury Car Detailing" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left w-full">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6 backdrop-blur-sm">
                <Sparkles size={14} />
                <span>Experiencia Premium Garantizada</span>
              </div>
              <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                Dale a tu vehículo <br />
                el brillo que <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">merece.</span>
              </h2>
              <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed">
                Transformamos tu auto con técnicas de detailing avanzadas, productos de alta gama y una pasión obsesiva por los detalles.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50"
                >
                  Reservar Turno
                  <ChevronRight className="ml-2" size={20} />
                </Link>
                <a href="#servicios" onClick={handleScrollToServices} className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-medium text-white border border-white/10 hover:bg-white/5 backdrop-blur-sm transition-all cursor-pointer">
                  Ver Servicios
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Características*/}
        <section className="pb-8 bg-slate-950 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Shield, title: "Protección Cerámica", desc: "Escudos de larga duración para tu pintura." },
                { icon: Clock, title: "Entrega Puntual", desc: "Respetamos tu tiempo con turnos precisos." },
                { icon: Star, title: "Calidad Premium", desc: "Solo usamos productos importados certificados." }
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="p-3 bg-slate-900 rounded-lg text-blue-400 border border-slate-800">
                    <feature.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grid de Servicios */}
        <section id="servicios" className="relative py-18 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">Nuestros Servicios Exclusivos</h3>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full"></div>
            </div>

            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}

            {error && (
              <div className="max-w-md mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400">
                {error}
              </div>
            )}

            {!loading && !error && tareas.length === 0 && (
              <div className="text-center text-slate-500 py-12">
                No hay servicios configurados actualmente.
              </div>
            )}

            {!loading && !error && Array.isArray(tareas) && tareas.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tareas.filter(tarea => tarea.isActive !== false).map((tarea, index) => (
                  <div 
                    key={tarea._id} 
                    className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10"
                  >
                    <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300 shadow-lg">
                      {getIconForService(index)}
                    </div>

                    <h4 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                      {tarea.descripcion}
                    </h4>
                    
                    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-800">
                      <div className="flex items-center justify-between text-slate-300">
                        <div className="flex items-center gap-2">
                          <DollarSign size={18} className="text-green-400" />
                          <span className="font-mono text-lg font-semibold text-white">
                            {tarea.precio.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs px-2 py-1 bg-slate-800 rounded text-slate-400">
                          <Timer size={12} />
                          <span>{tarea.tiempo_estimado} min</span>
                        </div>
                      </div>
                      
                      <Link to="/register" className="mt-2 w-full py-2 text-center text-sm font-medium text-slate-400 hover:text-white bg-slate-800/50 hover:bg-blue-600 rounded-lg transition-all">
                        Reservar este
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="relative py-8 overflow-hidden">
          <div className="absolute inset-0 bg-blue-900/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-3xl sm:text-5xl font-bold mb-6">¿Listo para transformar tu auto?</h3>
            <p className="text-lg text-slate-300 mb-8">
              Únete a cientos de clientes satisfechos que confían en nosotros para mantener sus vehículos impecables.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-slate-300 mb-8 text-sm">
                <div className="flex items-center gap-2"><CheckCircle2 className="text-blue-500" size={16}/> Garantía de satisfacción</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="text-blue-500" size={16}/> Productos biodegradables</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="text-blue-500" size={16}/> Atención personalizada</div>
            </div>
          </div>
        </section>
          <Mapa />
      </main>


      <footer className="bg-slate-950 border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">FUTURA DETAILING</span>
          </div>
          <p className="text-slate-500 text-sm">© 2025 FUTURA DETAILING. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;