
import React from 'react';

const BRANDS = [
  { name: 'Ray-Ban', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Ray-Ban_logo.svg' },
  { name: 'Oakley', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Oakley_logo.svg' },
  { name: 'Prada', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Prada-Logo.svg' },
  { name: 'Gucci', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Gucci_Logo.svg' },
  { name: 'Vogue', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Vogue_logo.svg' }
];

const BrandShowcase: React.FC = () => {
  return (
    <section className="py-20 bg-white overflow-hidden border-t border-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-4">Colecciones Premium</h2>
          <p className="text-2xl font-black text-slate-900">Distribuidores autorizados de las mejores marcas</p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
          {BRANDS.map((brand) => (
            <div 
              key={brand.name} 
              className="w-24 md:w-32 grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100 transform hover:scale-110 cursor-pointer flex items-center justify-center"
            >
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="max-w-full h-auto max-h-12 object-contain"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Todas nuestras marcas cuentan con garantía original de fábrica. 
            Calidad garantizada en cada marco y lente que entregamos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;
