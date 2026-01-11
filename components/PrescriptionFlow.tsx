
import React, { useState } from 'react';

const PrescriptionFlow: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = () => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      alert("Fórmula cargada con éxito. Nuestro optómetra la revisará en breve.");
    }, 2000);
  };

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden" id="servicios">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
            {/* Visual Grid of Health Trust */}
            <div className="grid grid-cols-2 gap-6 relative z-10">
              <div className="space-y-6">
                <div className="relative group overflow-hidden rounded-3xl">
                  <img src="https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=500&auto=format&fit=crop" className="w-full transition-transform duration-700 group-hover:scale-110" alt="Tecnología Óptica" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                </div>
                <div className="bg-blue-600 p-8 rounded-3xl shadow-2xl shadow-blue-600/20 text-center transform hover:-rotate-2 transition-transform">
                   <p className="text-4xl font-black mb-1">0%</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Margen de Error</p>
                </div>
              </div>
              <div className="pt-12 space-y-6">
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center transform hover:rotate-2 transition-transform">
                   <p className="text-3xl font-black mb-2">Bogotá</p>
                   <p className="text-xs text-slate-400">Atención presencial en nuestras sedes físicas.</p>
                </div>
                <div className="relative group overflow-hidden rounded-3xl">
                  <img src="https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=500&auto=format&fit=crop" className="w-full transition-transform duration-700 group-hover:scale-110" alt="Examen Visual" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                </div>
              </div>
            </div>
            {/* Abstract Background Decoration */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Salud Visual Profesional</span>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Configurar tus lentes <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">nunca fue tan simple.</span></h2>
            
            <div className="space-y-10">
              <div className="flex gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex-shrink-0 flex items-center justify-center font-black text-xl text-blue-500 border border-white/10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">1</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Carga tu Fórmula</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Sube una foto de tu receta médica. Nuestros expertos la validarán para asegurar una precisión milimétrica.</p>
                </div>
              </div>
              
              <div className="flex gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex-shrink-0 flex items-center justify-center font-black text-xl text-blue-500 border border-white/10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">2</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">¿Sin examen? Agéndate Gratis</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Si no tienes fórmula reciente, visítanos. El examen es <strong>cortesía de la casa</strong> al comprar tu montura.</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex-shrink-0 flex items-center justify-center font-black text-xl text-blue-500 border border-white/10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">3</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Envío Express Asegurado</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Recibe en tu puerta de 2 a 4 días hábiles con garantía de adaptación total de 30 días.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleUploadClick}
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-10 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/30 group"
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-y-[-2px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Subir Fórmula Médica
                  </>
                )}
              </button>
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-4 rounded-2xl font-black transition-all">
                Agendar Examen
              </button>
            </div>

            <div className="mt-8 flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
               <div className="flex gap-1">
                  <span className="text-yellow-400">★★★★★</span>
               </div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avalado por el Consejo Nacional de Optometría</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrescriptionFlow;
