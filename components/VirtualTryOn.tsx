
import React, { useState, useRef, useEffect } from 'react';
import { FaceShape, Product, Category } from '../types';

// Curated frames for the Virtual Try-On experience with specific recommendations
const VTO_FRAMES: Product[] = [
  { 
    id: 'v1', 
    name: 'Aviator Classic', 
    brand: 'Ray-Ban', 
    price: 680000, 
    category: Category.SOL, 
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=300&auto=format&fit=crop',
    recommendedFor: [FaceShape.SQUARE, FaceShape.HEART, FaceShape.OVAL] 
  },
  { 
    id: 'v2', 
    name: 'Clubmaster Retro', 
    brand: 'Ray-Ban', 
    price: 540000, 
    category: Category.OFTALMICAS, 
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=300&auto=format&fit=crop',
    recommendedFor: [FaceShape.ROUND, FaceShape.OVAL] 
  },
  { 
    id: 'v3', 
    name: 'Wayfarer Lite', 
    brand: 'Ray-Ban', 
    price: 490000, 
    category: Category.SOL, 
    image: 'https://images.unsplash.com/photo-1511499767350-a1590fdb2ca8?q=80&w=300&auto=format&fit=crop',
    recommendedFor: [FaceShape.OVAL, FaceShape.HEART] 
  },
  { 
    id: 'v4', 
    name: 'Holbrook Matte', 
    brand: 'Oakley', 
    price: 595000, 
    category: Category.SOL, 
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=300&auto=format&fit=crop',
    recommendedFor: [FaceShape.ROUND, FaceShape.SQUARE] 
  },
  { 
    id: 'v5', 
    name: 'Round Metal', 
    brand: 'Ray-Ban', 
    price: 520000, 
    category: Category.OFTALMICAS, 
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=300&auto=format&fit=crop',
    recommendedFor: [FaceShape.SQUARE, FaceShape.HEART] 
  }
];

const VirtualTryOn: React.FC = () => {
  const [step, setStep] = useState<'idle' | 'camera' | 'analyzing' | 'result'>('idle');
  const [detectedShape, setDetectedShape] = useState<FaceShape | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<Product>(VTO_FRAMES[1]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStep('camera');
      }
    } catch (err) {
      alert("Necesitamos acceso a la cámara para el probador virtual. Por favor, verifica los permisos.");
    }
  };

  const analyzeFace = () => {
    setStep('analyzing');
    // Simulate complex biometric analysis duration
    setTimeout(() => {
      const shapes = [FaceShape.ROUND, FaceShape.OVAL, FaceShape.SQUARE, FaceShape.HEART];
      const result = shapes[Math.floor(Math.random() * shapes.length)];
      setDetectedShape(result);
      
      // Auto-select the first frame that matches the detected shape
      const bestMatch = VTO_FRAMES.find(f => f.recommendedFor?.includes(result));
      if (bestMatch) setSelectedFrame(bestMatch);
      
      setStep('result');
    }, 2800);
  };

  const stopCamera = () => {
    const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
    tracks?.forEach(t => t.stop());
    setStep('idle');
    setDetectedShape(null);
  };

  // Reorder frames so recommended ones are prioritized
  const sortedFrames = [...VTO_FRAMES].sort((a, b) => {
    if (!detectedShape) return 0;
    const aMatches = a.recommendedFor?.includes(detectedShape) ? 1 : 0;
    const bMatches = b.recommendedFor?.includes(detectedShape) ? 1 : 0;
    return bMatches - aMatches;
  });

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative" id="probador-virtual">
      {/* Dynamic light background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.08),transparent)] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Tecnología Biométrica 2.0
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Probador Virtual <span className="text-blue-500">Inteligente</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Encuentra los marcos perfectos para tu fisionomía. Nuestra IA analiza tu rostro y filtra el catálogo para destacar lo que mejor te luce.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Main Interactive Stage */}
            <div className="lg:col-span-8 relative aspect-video md:aspect-square lg:aspect-video bg-black rounded-[3rem] overflow-hidden border-4 border-white/5 shadow-[0_0_100px_rgba(37,99,235,0.15)] group">
              {step === 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[url('https://images.unsplash.com/photo-1556015048-4d3aa10df74c?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm"></div>
                  <div className="relative z-10">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse shadow-2xl shadow-blue-600/40">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-black mb-4">¿Preparado para verte increíble?</h3>
                    <p className="text-slate-400 mb-10 max-w-sm mx-auto">Activa tu cámara para iniciar el escaneo facial y recibir recomendaciones personalizadas.</p>
                    <button 
                      onClick={startCamera}
                      className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-lg hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                    >
                      Iniciar Espejo Virtual
                    </button>
                  </div>
                </div>
              )}

              {(step === 'camera' || step === 'analyzing' || step === 'result') && (
                <div className="relative w-full h-full">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  
                  {/* Face Tracking HUD */}
                  {step === 'camera' && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-80 h-80 border-2 border-white/20 rounded-full relative">
                         <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                         <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-right-4 border-blue-500 rounded-tr-lg border-r-4"></div>
                         <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                         <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-right-4 border-blue-500 rounded-br-lg border-r-4"></div>
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center bg-black/40 backdrop-blur-xl p-6 rounded-3xl pointer-events-auto border border-white/10">
                              <p className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">Centra tu rostro</p>
                              <button 
                                onClick={analyzeFace}
                                className="bg-blue-600 px-8 py-3 rounded-xl font-black hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30"
                              >
                                Analizar Ahora
                              </button>
                            </div>
                         </div>
                      </div>
                    </div>
                  )}

                  {step === 'analyzing' && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center">
                      <div className="relative w-48 h-48 mb-8">
                         <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                         <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                         <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-2xl font-black">78%</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Escaneando</span>
                         </div>
                      </div>
                      <p className="text-xl font-black tracking-widest uppercase animate-pulse">Analizando estructura ósea...</p>
                    </div>
                  )}

                  {step === 'result' && (
                    <div className="absolute inset-0 flex flex-col justify-end p-8 pointer-events-none">
                       {/* Realistic-ish Frame Overlay Simulation */}
                       <div className="w-full flex justify-center mb-20 transition-all duration-700">
                          <img 
                            src={selectedFrame.image} 
                            className="w-64 md:w-80 drop-shadow-[0_35px_60px_rgba(0,0,0,0.8)] animate-pulse transition-all duration-300" 
                            style={{ 
                               mixBlendMode: 'multiply', 
                               filter: 'contrast(1.2) brightness(1.05)',
                               opacity: 0.95
                            }}
                            alt="Frame Overlay"
                          />
                       </div>
                       
                       <div className="bg-slate-900/95 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 pointer-events-auto flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform translate-y-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                               </svg>
                            </div>
                            <div>
                               <div className="flex items-center gap-2 mb-1">
                                  <span className="bg-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Perfect Match</span>
                                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Rostro {detectedShape}</p>
                               </div>
                               <h4 className="text-2xl font-black leading-tight">{selectedFrame.name}</h4>
                               <p className="text-slate-400 text-sm">{selectedFrame.brand} • <span className="text-white font-bold">${selectedFrame.price.toLocaleString('es-CO')}</span></p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                             <button className="bg-white text-slate-900 p-4 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                             </button>
                          </div>
                       </div>
                    </div>
                  )}

                  <button 
                    onClick={stopCamera}
                    className="absolute top-8 right-8 bg-black/50 hover:bg-red-500/80 backdrop-blur-xl p-3.5 rounded-2xl transition-all pointer-events-auto border border-white/10"
                    title="Cerrar Probador"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Recommendations & Catalog Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
               <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] flex-grow flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-lg font-black flex items-center gap-3">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></span>
                      Catálogo AI
                    </h4>
                    {detectedShape && (
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Filtro Inteligente</span>
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{detectedShape}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar flex-grow">
                    {sortedFrames.map(frame => {
                      const isMatch = detectedShape && frame.recommendedFor?.includes(detectedShape);
                      const isSelected = selectedFrame.id === frame.id;

                      return (
                        <button 
                          key={frame.id} 
                          onClick={() => setSelectedFrame(frame)}
                          className={`w-full group relative flex gap-4 p-5 rounded-3xl transition-all border text-left active:scale-95 ${
                            isSelected 
                              ? 'bg-blue-600 border-blue-500 shadow-[0_15px_30px_rgba(37,99,235,0.25)]' 
                              : 'bg-white/5 border-white/5 hover:border-white/15'
                          }`}
                        >
                          {isMatch && !isSelected && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-[7px] font-black text-white px-2 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                              Match Ideal
                            </div>
                          )}
                          
                          <div className="w-20 h-20 bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-inner">
                            <img 
                              src={frame.image} 
                              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-115 ${isSelected ? 'scale-110' : ''}`} 
                              alt={frame.name}
                            />
                          </div>
                          <div className="flex flex-col justify-center flex-grow">
                            <p className={`text-[9px] font-black uppercase tracking-[0.15em] mb-1 ${isSelected ? 'text-blue-100' : 'text-blue-400'}`}>
                              {frame.brand}
                            </p>
                            <h5 className={`font-black text-sm leading-tight mb-1 ${isSelected ? 'text-white' : 'text-slate-100 group-hover:text-blue-400'}`}>
                              {frame.name}
                            </h5>
                            <p className={`text-xs font-bold ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                              ${frame.price.toLocaleString('es-CO')}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
               </div>
               
               <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-8 rounded-[3rem] text-center shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <h4 className="text-xl font-black mb-2 relative z-10">Asesoría de Rostro</h4>
                  <p className="text-sm text-slate-400 mb-6 relative z-10">¿Aún con dudas? Agenda una videollamada gratuita con un estilista óptico.</p>
                  <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 relative z-10">
                    Agendar Estilista
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(37, 99, 235, 0.3);
        }
      `}</style>
    </section>
  );
};

export default VirtualTryOn;
