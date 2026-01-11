
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FaceShape, Product, Category } from '../types';

const VTO_FRAMES: (Product & { description: string, style: string, previewBg: string })[] = [
  { 
    id: 'v1', 
    name: 'Aviator Classic Gold', 
    brand: 'Ray-Ban', 
    price: 320000, 
    category: Category.OFTALMICAS, 
    image: 'https://m.media-amazon.com/images/I/51goCc6WB9L._AC_SL400_.jpg', 
    recommendedFor: [FaceShape.SQUARE, FaceShape.HEART], 
    style: 'Minimalista', 
    description: 'Gafas de sol negras Ray-Ban.',
    previewBg: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=400&auto=format&fit=crop'
  },
  { 
    id: 'v2', 
    name: 'Clubmaster Black', 
    brand: 'Ray-Ban', 
    price: 540000, 
    category: Category.OFTALMICAS, 
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=400&auto=format&fit=crop', 
    recommendedFor: [FaceShape.ROUND, FaceShape.OVAL], 
    style: 'Moderno', 
    description: 'Inspiración retro de los años 50 con toques contemporáneos.',
    previewBg: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=400&auto=format&fit=crop'
  },
  { 
    id: 'v4', 
    name: 'Holbrook Sport', 
    brand: 'Oakley', 
    price: 595000, 
    category: Category.SOL, 
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=500&auto=format&fit=crop', 
    recommendedFor: [FaceShape.ROUND, FaceShape.SQUARE], 
    style: 'Sport', 
    description: 'Material O Matter™ de alta resistencia y ligereza.',
    previewBg: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=400&auto=format&fit=crop'
  }
];

type Step = 'setup' | 'capturing' | 'analyzing' | 'experience';
type Angle = 'frontal' | 'left' | 'right';

interface HistoryItem {
  id: string;
  image: string;
  frame: Product;
}

const VirtualTryOn: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('setup');
  const [currentAngle, setCurrentAngle] = useState<Angle>('frontal');
  const [photos, setPhotos] = useState<Record<Angle, string | null>>({ frontal: null, left: null, right: null });
  const [detectedShape, setDetectedShape] = useState<FaceShape | null>(null);
  const [selectedFrame, setSelectedFrame] = useState(VTO_FRAMES[0]);
  const [isRendering, setIsRendering] = useState(false);
  const [aiRenderedImage, setAiRenderedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [budget, setBudget] = useState<number>(800000);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (currentStep === 'capturing') startCamera();
    return () => stopCamera();
  }, [currentStep]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Permiso de cámara denegado.");
      setCurrentStep('setup');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx?.save();
      ctx?.scale(-1, 1);
      ctx?.drawImage(videoRef.current, -canvasRef.current.width, 0);
      ctx?.restore();
      
      const data = canvasRef.current.toDataURL('image/png');
      const newPhotos = { ...photos, [currentAngle]: data };
      setPhotos(newPhotos);

      if (currentAngle === 'frontal') setCurrentAngle('left');
      else if (currentAngle === 'left') setCurrentAngle('right');
      else analyzeFace(newPhotos);
    }
  };

  const analyzeFace = async (allPhotos: Record<Angle, string | null>) => {
    setCurrentStep('analyzing');
    stopCamera();
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const frontalData = allPhotos.frontal?.split(',')[1];
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{
          parts: [
            { text: "Detecta la forma del rostro (Redondo, Ovalado, Cuadrado, Corazón). Solo devuelve la palabra." },
            { inlineData: { mimeType: 'image/png', data: frontalData! } }
          ]
        }]
      });
      const shape = response.text?.trim() as FaceShape;
      setDetectedShape(Object.values(FaceShape).includes(shape) ? shape : FaceShape.OVAL);
      setCurrentStep('experience');
    } catch (err) {
      setDetectedShape(FaceShape.OVAL);
      setCurrentStep('experience');
    }
  };

  const renderRealisticFusion = async () => {
    setIsRendering(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const frontalData = photos.frontal?.split(',')[1];
      
      const prompt = `Image-to-image realism: Place these specific glasses "${selectedFrame.name}" on the person's face in the photo. 
      The glasses must fit exactly on the nose bridge. High-quality reflections on lenses. Suble shadows on the face from the frame. 
      Professional retail quality.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/png', data: frontalData! } },
            { text: prompt }
          ]
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const newImage = `data:image/png;base64,${part.inlineData.data}`;
          setAiRenderedImage(newImage);
          // Add to history
          setHistory(prev => [
            { id: Date.now().toString(), image: newImage, frame: selectedFrame },
            ...prev
          ].slice(0, 5)); // Keep last 5 tests
          break;
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error en el renderizado IA.");
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <section className="py-12 bg-slate-950 text-white min-h-screen" id="probador-virtual">
      <div className="container mx-auto px-4">
        
        {currentStep === 'setup' && (
          <div className="max-w-4xl mx-auto text-center py-32 bg-white/[0.02] rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
            <span className="text-blue-500 font-black text-xs uppercase tracking-[0.4em] mb-4 block">Tecnología de Vanguardia</span>
            <h2 className="text-6xl font-black mb-8 tracking-tighter">Digital <span className="text-blue-600">Twin Studio</span></h2>
            <p className="text-slate-400 mb-12 max-w-xl mx-auto text-xl leading-relaxed">
              Escanea tu rostro y descubre cómo lucen tus nuevas gafas con precisión milimétrica y renderizado hiper-realista.
            </p>
            <button onClick={() => setCurrentStep('capturing')} className="bg-blue-600 hover:bg-blue-500 text-white px-16 py-6 rounded-[2.5rem] font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95">
              Iniciar Escaneo 3D
            </button>
          </div>
        )}

        {currentStep === 'capturing' && (
          <div className="grid lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
            <div className="relative aspect-square bg-black rounded-[4rem] overflow-hidden border-8 border-white/5 shadow-2xl">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-2/3 h-2/3 border-2 border-dashed border-blue-500/50 rounded-full flex items-center justify-center">
                  <div className="bg-blue-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                    Ángulo {currentAngle}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-12">
              <h3 className="text-5xl font-black tracking-tighter">Captura Biométrica</h3>
              <p className="text-slate-400 text-xl leading-relaxed">Necesitamos 3 capturas de tu rostro para mapear tus facciones y recomendarte la montura ideal.</p>
              <div className="flex gap-6">
                {(['frontal', 'left', 'right'] as Angle[]).map(a => (
                  <div key={a} className={`w-28 h-28 rounded-[2rem] border-2 flex items-center justify-center transition-all overflow-hidden ${photos[a] ? 'border-green-500 bg-green-500/10' : 'border-white/10 opacity-30 bg-white/5'}`}>
                    {photos[a] ? <img src={photos[a]!} className="w-full h-full object-cover" /> : <span className="text-[10px] font-black uppercase tracking-tighter">{a}</span>}
                  </div>
                ))}
              </div>
              <button onClick={capturePhoto} className="w-full bg-white text-slate-950 py-7 rounded-[2.5rem] font-black text-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-[0.98]">
                Capturar {currentAngle}
              </button>
            </div>
          </div>
        )}

        {currentStep === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-48">
            <div className="relative w-32 h-32 mb-12">
              <div className="absolute inset-0 border-8 border-blue-600/10 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-3xl font-black uppercase tracking-[0.5em] animate-pulse">Analizando Perfil...</h3>
          </div>
        )}

        {currentStep === 'experience' && (
          <div className="grid lg:grid-cols-12 gap-12 items-start max-w-[1400px] mx-auto">
            
            {/* Main Avatar Stage */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="bg-black/40 rounded-[4rem] relative overflow-hidden shadow-2xl min-h-[700px] flex items-center justify-center border border-white/5 group">
                {aiRenderedImage ? (
                  <img src={aiRenderedImage} className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in duration-1000" alt="Fused Result" />
                ) : (
                  <img src={photos.frontal!} className="absolute inset-0 w-full h-full object-cover opacity-70 grayscale-[0.2]" alt="Clean Avatar" />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20"></div>
                
                {/* Overlay Face Label */}
                <div className="absolute top-12 left-12 flex gap-3">
                  <span className="bg-blue-600/90 backdrop-blur-md text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest border border-blue-500/20">ROSTRO {detectedShape}</span>
                  {aiRenderedImage && <span className="bg-purple-600/90 backdrop-blur-md text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest animate-pulse">IA Render Active</span>}
                </div>

                {/* Bottom Info Bar */}
                <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-6">
                  <div className="text-left animate-in slide-in-from-bottom duration-700">
                    <h4 className="text-5xl font-black mb-2 tracking-tighter">{selectedFrame.name}</h4>
                    <p className="text-slate-400 text-lg mb-4 max-w-sm italic">"{selectedFrame.description}"</p>
                    <div className="flex items-center gap-6">
                      <span className="text-4xl font-black text-white">${selectedFrame.price.toLocaleString('es-CO')}</span>
                      <button className="bg-white text-slate-950 px-10 py-5 rounded-[2.5rem] font-black text-lg hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95">
                        Comprar Ahora
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* History Gallery (THE ADDED PART AS PER REFERENCE) */}
              <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[4rem] backdrop-blur-3xl">
                <div className="flex items-center justify-between mb-8">
                   <h5 className="font-black text-xs uppercase tracking-[0.4em] text-blue-400">Pruebas Recientes</h5>
                   <button onClick={() => { setHistory([]); setAiRenderedImage(null); }} className="text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Limpiar Galería</button>
                </div>
                
                <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                  {history.length > 0 ? history.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => {
                        setAiRenderedImage(item.image);
                        setSelectedFrame(item.frame as any);
                      }}
                      className={`group relative flex-shrink-0 w-44 aspect-square rounded-[2rem] border-2 transition-all overflow-hidden ${
                        aiRenderedImage === item.image ? 'border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="History" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                        <p className="text-[8px] font-black uppercase truncate">{item.frame.name}</p>
                      </div>
                    </button>
                  )) : (
                    <div className="flex gap-6">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-44 aspect-square rounded-[2rem] border-2 border-dashed border-white/5 flex items-center justify-center opacity-20">
                            <span className="text-[10px] font-black uppercase">Fusión {i}</span>
                         </div>
                       ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Selection Sidebar */}
            <div className="lg:col-span-4 space-y-8 flex flex-col h-full sticky top-8">
              
              {/* Budget Card */}
              <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[4rem] backdrop-blur-3xl shadow-2xl">
                <div className="flex justify-between items-end mb-8">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Presupuesto</label>
                  <span className="text-blue-400 text-2xl font-black tracking-tight">${budget.toLocaleString('es-CO')}</span>
                </div>
                <input 
                  type="range" min="300000" max="1500000" step="50000" value={budget} 
                  onChange={(e) => {
                    setBudget(parseInt(e.target.value));
                    setAiRenderedImage(null);
                  }}
                  className="w-full accent-blue-600 h-2 bg-slate-800 rounded-full appearance-none cursor-pointer mb-2"
                />
              </div>

              {/* Product Preview Card */}
              <div className="relative group overflow-hidden rounded-[4rem] aspect-[4/5] border border-white/10 shadow-2xl bg-slate-900">
                <img src={selectedFrame.previewBg} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm scale-110 group-hover:scale-125 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90"></div>
                
                <div className="relative h-full flex flex-col items-center justify-center p-10">
                  <img src={selectedFrame.image} className="w-full drop-shadow-[0_35px_60px_rgba(0,0,0,0.8)] transform rotate-[-5deg] group-hover:rotate-0 transition-transform duration-700" alt="Product Shot" />
                  
                  <div className="mt-12 text-center">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">{selectedFrame.brand}</p>
                    <h5 className="text-2xl font-black tracking-tight">{selectedFrame.name}</h5>
                  </div>
                </div>

                <div className="absolute bottom-10 left-10 right-10">
                  <button 
                    onClick={renderRealisticFusion}
                    disabled={isRendering}
                    className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
                      isRendering ? 'bg-slate-700 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'
                    }`}
                  >
                    {isRendering ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Analizando...
                      </>
                    ) : '✨ Fusión Realista (IA)'}
                  </button>
                </div>
              </div>

              {/* Match Automático List */}
              <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[4rem] backdrop-blur-3xl shadow-2xl flex-grow flex flex-col overflow-hidden max-h-[350px]">
                <h5 className="font-black text-xs uppercase tracking-[0.3em] text-blue-400 mb-6">Match Automático</h5>
                <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                  {VTO_FRAMES.filter(f => f.price <= budget).map(frame => (
                    <button 
                      key={frame.id}
                      onClick={() => {
                        setSelectedFrame(frame);
                        setAiRenderedImage(null);
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-[2.5rem] transition-all border ${
                        selectedFrame.id === frame.id ? 'bg-blue-600 border-blue-500 shadow-lg' : 'bg-white/5 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <div className="w-16 h-16 bg-slate-800 rounded-3xl overflow-hidden p-2 flex items-center justify-center">
                        <img src={frame.image} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="text-left flex-grow">
                        <p className={`text-[8px] font-black uppercase ${selectedFrame.id === frame.id ? 'text-blue-100' : 'text-slate-500'}`}>{frame.brand}</p>
                        <h6 className="font-bold text-sm leading-tight">{frame.name}</h6>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  setCurrentStep('setup');
                  setAiRenderedImage(null);
                  setHistory([]);
                  setPhotos({ frontal: null, left: null, right: null });
                }}
                className="w-full text-slate-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest pb-8"
              >
                NUEVO ESCANEO BIOMÉTRICO
              </button>
            </div>
          </div>
        )}

      </div>
      <canvas ref={canvasRef} className="hidden" />
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </section>
  );
};

export default VirtualTryOn;
