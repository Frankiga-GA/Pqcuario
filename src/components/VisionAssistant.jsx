import { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Check, X, RefreshCw, Eye, AlertTriangle, Trash2 } from 'lucide-react';
import { upsertProductionRecord } from '../lib/storage';
import { requestIAVetAI, extractJsonObject } from '../lib/aiService';

export default function VisionAssistant() {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setError(null);
      const reader = new FileReader();
      reader.onload = (en) => {
        const base64 = en.target.result;
        setImage(base64);
        analyzeImageReal(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImageReal = async (base64Image) => {
    setAnalyzing(true);
    setResult(null);
    setConfirmed(false);
    setError(null);

    try {
      const prompt = `Analiza esta imagen del nido/bandeja:
      1. Cuenta cuántos huevos totales hay.
      2. Identifica si alguno está roto, sucio o en mal estado (merma).
      3. Devuelve SOLO un objeto JSON con este formato exacto: 
      { 
        "count": número_huevos_sanos, 
        "damaged": número_huevos_rotos_o_malos,
        "confidence": 0.0-1.0, 
        "notes": "explicación breve de lo que viste (ej: veo 7 huevos limpios y 1 con cáscara rota)" 
      }`;

      const aiResponse = await requestIAVetAI({
        message: prompt,
        image: base64Image
      });

      const parsed = extractJsonObject(aiResponse);
      
      if (parsed && typeof parsed.count === 'number') {
        setResult({
          count: parsed.count,
          damaged: parsed.damaged || 0,
          confidence: parsed.confidence || 0.85,
          notes: parsed.notes || 'Análisis de calidad finalizado.'
        });
      } else {
        throw new Error('No se pudo identificar el conteo en la respuesta.');
      }
    } catch (err) {
      console.error(err);
      setError('No pude analizar la calidad. Intenta con una foto más clara o revisa tu conexión.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConfirm = () => {
    if (!result) return;
    
    const today = new Date().toISOString().split('T')[0];
    upsertProductionRecord({
      id: Date.now().toString(),
      date: today,
      eggs: result.count,
      damaged: result.damaged,
      note: `IA detectó ${result.count} sanos y ${result.damaged} merma. ${result.notes}`
    });
    
    setConfirmed(true);
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setConfirmed(false);
    setError(null);
  };

  return (
    <div className="card-glass overflow-hidden border-emerald-100 bg-white/50">
      <div className="flex items-center justify-between border-b border-emerald-50 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <Eye size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">Control de Calidad IA</h3>
            <p className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">IA detecta sanos y merma</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={analyzing ? "flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" : "flex h-2 w-2 rounded-full bg-emerald-500"} />
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
            {analyzing ? 'Analizando Calidad' : 'IA Lista'}
          </span>
        </div>
      </div>

      <div className="p-4">
        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-3 text-red-800">
            <AlertTriangle size={18} className="shrink-0" />
            <p className="text-xs font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {!image ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex aspect-video cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-emerald-300 hover:bg-emerald-50/30"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110">
              <Camera size={24} className="text-slate-400 group-hover:text-emerald-500" />
            </div>
            <p className="text-sm font-black text-slate-700">Toma foto de la producción</p>
            <p className="mt-1 px-8 text-center text-[11px] font-medium leading-relaxed text-slate-500">
              Detectaremos automáticamente cuántos están sanos y cuántos rotos.
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200 shadow-inner bg-slate-900">
              <img src={image} className={analyzing ? "h-full w-full object-cover opacity-50 transition-opacity" : "h-full w-full object-cover opacity-100 transition-opacity"} alt="Capture" />
              
              {analyzing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/20 backdrop-blur-[1px]">
                  <RefreshCw size={32} className="mb-3 animate-spin text-emerald-400" />
                  <p className="text-xs font-black uppercase tracking-widest text-white">Evaluando Calidad...</p>
                </div>
              )}
            </div>

            {result && !analyzing && (
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center">
                  <p className="text-[10px] font-bold uppercase text-emerald-600">Huevos Sanos</p>
                  <p className="text-xl font-black text-emerald-700">{result.count}</p>
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-center">
                  <p className="text-[10px] font-bold uppercase text-red-400">Merma (Rotos)</p>
                  <p className="text-xl font-black text-red-700">{result.damaged}</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button 
                onClick={reset}
                className="btn-secondary flex-1 justify-center py-3"
              >
                <RefreshCw size={14} />
                Reiniciar
              </button>
              
              {!confirmed ? (
                <button 
                  onClick={handleConfirm}
                  disabled={analyzing || !result}
                  className="btn-primary flex-1 justify-center py-3"
                >
                  <Check size={14} />
                  Confirmar y Guardar
                </button>
              ) : (
                <button 
                  disabled
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-black text-white"
                >
                  <Sparkles size={14} />
                  Sincronizado
                </button>
              )}
            </div>

            {result?.notes && !confirmed && !analyzing && (
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <p className="text-[11px] font-medium leading-relaxed text-slate-600 italic">
                  "{result.notes}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
