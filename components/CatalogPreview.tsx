
import React from 'react';
import { Category, Product, FaceShape } from '../types';

const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Aviator Classic Gold', 
    brand: 'Ray-Ban', 
    price: 680000, 
    category: Category.SOL, 
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=500&auto=format&fit=crop', 
    badge: 'Trending',
    recommendedFor: [FaceShape.SQUARE, FaceShape.HEART]
  },
  { 
    id: '2', 
    name: 'Holbrook Matte Black', 
    brand: 'Oakley', 
    price: 595000, 
    category: Category.SOL, 
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=500&auto=format&fit=crop',
    recommendedFor: [FaceShape.ROUND, FaceShape.OVAL]
  },
  { 
    id: '3', 
    name: 'Milanese Blue Light', 
    brand: 'ABC Collection', 
    price: 345000, 
    category: Category.OFTALMICAS, 
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=500&auto=format&fit=crop', 
    badge: 'Protección Luz Azul',
    recommendedFor: [FaceShape.OVAL]
  },
  { 
    id: '4', 
    name: 'Acuvue Moist (30 Pack)', 
    brand: 'Johnson & Johnson', 
    price: 185000, 
    category: Category.LENTES_CONTACTO, 
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=500&auto=format&fit=crop' 
  },
];

const CatalogPreview: React.FC = () => {
  const scrollToVTO = () => {
    const vtoSection = document.getElementById('probador-virtual');
    if (vtoSection) {
      vtoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-slate-50" id="gafas-oftalmicas">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <span className="text-blue-600 font-black uppercase tracking-widest text-[10px] mb-2 block">Curaduría Exclusiva</span>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Best Sellers de la Temporada</h2>
            <p className="text-slate-600 leading-relaxed">
              Descubre los marcos que están definiendo la moda visual este año. Incluimos <strong>filtro de luz azul</strong> sin costo adicional en tus lentes formulados.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-3 rounded-2xl bg-white border border-slate-200 font-black text-sm hover:bg-slate-900 hover:text-white transition-all shadow-sm">
              Explorar Todo el Catálogo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map((product) => (
            <div key={product.id} className="group bg-white rounded-[2.5rem] p-5 border border-slate-100 hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col">
              <div className="relative aspect-[4/5] rounded-[2rem] bg-slate-50 overflow-hidden mb-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                
                {product.badge && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm">
                    <span className="text-blue-600 text-[9px] font-black uppercase tracking-wider">{product.badge}</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       scrollToVTO();
                     }}
                     className="w-full bg-white text-slate-900 py-3 rounded-xl font-black text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform"
                   >
                      Pruébatelas en AI
                   </button>
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{product.brand}</p>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors leading-tight">{product.name}</h3>
                   </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                   <p className="text-blue-600 font-black text-xl">${product.price.toLocaleString('es-CO')}</p>
                   <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-900"></div>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CatalogPreview;
