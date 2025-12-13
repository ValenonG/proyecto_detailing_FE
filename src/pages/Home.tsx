import { Link } from 'react-router-dom';
import { Car, Sparkles, Shield, Clock } from 'lucide-react';

function Home() {
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
            <h2 className="text-5xl font-bold mb-6">
              Servicios de Detailing Profesional
            </h2>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-slate-700 p-6 rounded-lg">
                <Sparkles className="text-blue-500 mb-4" size={40} />
                <h4 className="text-xl font-semibold mb-2">Lavado Premium</h4>
                <p className="text-slate-400">
                  Limpieza profunda exterior e interior con productos de alta calidad.
                </p>
              </div>
              <div className="bg-slate-700 p-6 rounded-lg">
                <Shield className="text-blue-500 mb-4" size={40} />
                <h4 className="text-xl font-semibold mb-2">Tratamiento Cerámico</h4>
                <p className="text-slate-400">
                  Protección duradera para la pintura de tu vehículo.
                </p>
              </div>
              <div className="bg-slate-700 p-6 rounded-lg">
                <Car className="text-blue-500 mb-4" size={40} />
                <h4 className="text-xl font-semibold mb-2">Pulido y Encerado</h4>
                <p className="text-slate-400">
                  Restauramos el brillo original de tu auto.
                </p>
              </div>
              <div className="bg-slate-700 p-6 rounded-lg">
                <Clock className="text-blue-500 mb-4" size={40} />
                <h4 className="text-xl font-semibold mb-2">Servicio Express</h4>
                <p className="text-slate-400">
                  Lavado rápido sin comprometer la calidad.
                </p>
              </div>
            </div>
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
