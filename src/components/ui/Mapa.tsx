

function Mapa() {
    return (
        <section className="relative py-10 bg-slate-950 border-t border-white/5 overflow-hidden">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center mb-12">
                    <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight ">
                        Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Ubicación</span>
                    </h3>
                </div>
                
                <div className="relative group max-w-5xl mx-auto">
                    <div className="relative w-full h-[400px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
                        <iframe 
                        src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=Futura%20Detail%20Est%C3%A9tica%20vehicular+(Futura%20Detailing)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                        style={{ 
                            border: 0, 
                        }}
                        allowFullScreen={true}
                        loading="lazy"
                        className="w-full h-full">
                        </iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Mapa;