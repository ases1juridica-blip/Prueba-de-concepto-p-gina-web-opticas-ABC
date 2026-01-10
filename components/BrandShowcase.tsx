
import React from 'react';

const BRANDS = [
  { name: 'Ray-Ban', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Ray-Ban_logo.svg', desc: 'Estilo icónico desde 1937' },
  { name: 'Oakley', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Oakley_logo.svg', desc: 'Óptica de alto rendimiento' },
  { name: 'Prada', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Prada-Logo.svg', desc: 'Lujo y diseño italiano' },
  { name: 'Gucci', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Gucci_Logo.svg', desc: 'Elegancia vanguardista' },
  { name: 'Vogue', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Vogue_logo.svg', desc: 'Marcos modernos y femeninos' }
];

const BrandShowcase: React.FC = () => {
  return (
    <section className="py-24 bg-white border-y border-slate-100 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Distribuidor Autorizado Colombia
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">
            Nuestras Marcas Premium
          </h2>
          <p className="text-blue-600 font-bold text-lg mb-6">
            Pioneros en salud visual con el respaldo de las marcas más prestigiosas del mundo.
          </p>
          <p className="text-slate-500 max-w-xl text-sm">
            Garantizamos la autenticidad y el soporte técnico directo de fábrica en cada uno de nuestros modelos Ray-Ban, Oakley y colecciones de lujo.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8 items-center">
          {BRANDS.map((brand) => (
            <div 
              key={brand.name} 
              className="group flex flex-col items-center p-6 md:p-10 rounded-[2rem] hover:bg-slate-50 transition-all duration-500 cursor-pointer border border-transparent hover:border-slate-100"
            >
              <div className="h-10 md:h-12 w-full flex items-center justify-center mb-6">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="max-h-full max-w-[85%] object-contain grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-50 group-hover:opacity-100"
                />
              </div>
              <div className="text-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <p className="text-[10px] font-black uppercase text-blue-600 tracking-wider mb-0.5">{brand.name}</p>
                <p className="text-[9px] text-slate-400 font-medium whitespace-nowrap">{brand.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Support Banner */}
        <div className="mt-16 p-8 md:p-10 rounded-[2.5rem] bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-2xl font-black mb-2">¿Buscas una referencia específica?</h3>
            <p className="text-slate-400 text-sm">Nuestro equipo de Personal Shopper te ayuda a conseguir cualquier modelo bajo pedido especial.</p>
          </div>
          <button className="relative z-10 bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-white hover:text-slate-900 transition-all whitespace-nowrap shadow-lg shadow-blue-600/20">
            Consultar por WhatsApp
          </button>
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;
