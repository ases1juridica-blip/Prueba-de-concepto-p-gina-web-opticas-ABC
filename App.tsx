
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Agreements from './components/Agreements';
import CatalogPreview from './components/CatalogPreview';
import BrandShowcase from './components/BrandShowcase';
import VirtualTryOn from './components/VirtualTryOn';
import PrescriptionFlow from './components/PrescriptionFlow';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Banner (Optional Hook) */}
      <div className="bg-blue-600 text-white text-center py-2 px-4 text-xs font-bold tracking-widest uppercase">
        🚀 Envío Gratis a todo Colombia por compras superiores a $200.000
      </div>

      <Header />
      
      <main className="flex-grow">
        <Hero />
        <Agreements />
        <CatalogPreview />
        <BrandShowcase />
        <VirtualTryOn />
        <PrescriptionFlow />
        <Testimonials />
        
        {/* SEO Catchment Section */}
        <section className="py-16 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-4">Salud Visual de Confianza</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              En Ópticas ABC nos especializamos en ofrecer soluciones completas de salud visual. Desde <strong>gafas formuladas</strong> con lo último en tecnología de <strong>filtro luz azul</strong>, hasta <strong>lentes de contacto a domicilio</strong>. Realiza tu <strong>examen visual</strong> con expertos y agenda tu cita hoy mismo para prevenir la fatiga visual digital.
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default App;
