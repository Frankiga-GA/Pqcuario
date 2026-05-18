import { useState } from 'react';
import { ShieldCheck, Bot, HeartPulse, X, ArrowRight, Activity, Zap, Loader2, PlayCircle, BarChart3, TrendingUp, CheckCircle2, AlertCircle, Quote } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-100 group">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
        <Icon size={26} className="text-emerald-600" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Cuenta creada con éxito. Revisa tu correo para confirmar.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col z-10 w-full bg-white animate-fade-in font-sans">
      
      {/* --- HERO SECTION WITH VIDEO BACKGROUND --- */}
      <div className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* Image Background of Birds */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/aviculture_hero_bg.png"
            alt="Modern Aviculture Farm Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/65 backdrop-blur-[1px]"></div>
        </div>

        {/* Navbar Capsule Floating with Glass effect */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 pt-6">
          <nav className="w-full bg-white/30 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl flex items-center justify-between shadow-lg shadow-black/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 leading-tight tracking-tight">Pqcuario</h1>
                <span className="text-[9px] text-emerald-600 font-black tracking-widest uppercase">IAVet Agro</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setIsSignUp(false);
                  setShowLogin(true);
                }}
                className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md"
              >
                Iniciar Sesión
              </button>
            </div>
          </nav>
        </div>

        {/* Hero Content - Gorgeous 2-Column Grid */}
        <main className="relative z-10 flex-1 flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] items-center text-left w-full">
            {/* Left Column: Text & CTA */}
            <div className="space-y-6 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600/10 border border-emerald-600/20 text-emerald-800 text-xs font-black animate-slide-up">
                <Activity size={14} className="text-emerald-600 animate-pulse" />
                <span className="uppercase tracking-wide">Agrotech Avanzada & Conexión Local</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] animate-slide-up">
                IA y Visión Computacional para tu <span className="text-emerald-600">Granja Avícola</span>
              </h2>
              
              <p className="text-base md:text-lg text-slate-700 max-w-xl leading-relaxed font-medium animate-slide-up">
                Registra tu producción de huevos al instante con fotos, optimiza el alimento y proyecta utilidades en tiempo real para galpones en Ica y Chincha.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2 animate-slide-up">
                <button 
                  onClick={() => {
                    setIsSignUp(true);
                    setShowLogin(true);
                  }}
                  className="bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-base px-8 py-3.5 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/30 hover:-translate-y-0.5"
                >
                  Comenzar gratis
                  <ArrowRight size={18} />
                </button>
                <a 
                  href="#demostracion"
                  className="bg-white/80 backdrop-blur-sm text-slate-800 border border-slate-200 hover:border-slate-300 hover:bg-white font-bold text-base px-8 py-3.5 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <PlayCircle size={18} className="text-emerald-600" />
                  Saber más
                </a>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-500 pt-4 border-t border-slate-200/40 w-full">
                <div className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500"/> Gestión Multigalpones Real</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500"/> Conteo IA en 3 Segundos</div>
              </div>
            </div>

            {/* Right Column: Live Mockup Chat Widget (Fidelity Showcase) */}
            <div className="hidden lg:block relative w-full h-[450px] animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {/* Soft neon decorative circles in background */}
              <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl animate-pulse" />
              <div className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

              {/* Floating Chat Mockup */}
              <div className="relative w-full h-full rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">
                {/* Mockup Header */}
                <div className="px-5 py-4 border-b border-slate-200/40 bg-white/80 backdrop-blur-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                      <Bot size={18} className="text-emerald-700" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-none">Asistente IAVet</h4>
                      <span className="text-[10px] text-emerald-600 font-bold leading-none uppercase tracking-wider">Modo Inteligente</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  </div>
                </div>

                {/* Mockup Chat Area */}
                <div className="flex-1 p-5 space-y-4 overflow-y-auto min-h-0 text-left">
                  {/* User message */}
                  <div className="flex gap-3 justify-end">
                    <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-none px-4 py-2.5 text-xs font-semibold max-w-[80%] shadow-sm">
                      <p className="mb-2">Analiza la recolección de este galpón:</p>
                      <div className="relative rounded-lg overflow-hidden border border-emerald-500/30">
                        <img 
                          src="https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?q=80&w=300&auto=format&fit=crop" 
                          alt="Bandeja de huevos" 
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="px-2 py-1 rounded bg-black/60 text-[10px] font-bold text-white tracking-widest uppercase">Foto Escaneada</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                      <Bot size={15} className="text-emerald-700" />
                    </div>
                    <div className="bg-white/95 border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 text-xs font-medium text-slate-800 max-w-[85%] shadow-md space-y-2">
                      <p>🥚 **Análisis Visual Completado**:</p>
                      <ul className="space-y-1 pl-1 list-disc list-inside text-[11px] text-slate-600">
                        <li>Huevos saludables: <strong className="text-emerald-700">28 sanos</strong></li>
                        <li>Merma detectada: <strong className="text-red-600 font-bold">2 rotos / trizados</strong></li>
                        <li>Precisión del escaneo: <strong>98.6%</strong></li>
                      </ul>
                      <p className="text-[10px] text-slate-500 border-t border-slate-100 pt-1.5 font-bold leading-normal">
                        Recomendación: El porcentaje de merma es 6.7%. Sugiero revisar la dureza de cáscara o si hay huevos atorados en el nido.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mockup Input Box */}
                <div className="p-4 border-t border-slate-200/40 bg-white/80 backdrop-blur-sm flex gap-2">
                  <div className="flex-1 bg-slate-50 border border-slate-200/50 rounded-xl px-4 py-2.5 text-xs text-slate-400 font-bold flex items-center">
                    Escribe tu pregunta o sube una foto...
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- TRUST LOGOS FAJA --- */}
      <section className="bg-slate-50/50 py-10 relative z-20 border-b border-slate-100 overflow-hidden">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 25s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
          .mask-gradient {
            mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Operando con el respaldo técnico y confianza de granjas líderes</p>
          <div className="relative w-full overflow-hidden mask-gradient">
            <div className="animate-marquee flex gap-16 md:gap-24 items-center whitespace-nowrap opacity-65">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-16 md:gap-24 items-center pr-16 md:pr-24">
                  <span className="text-xs font-black text-slate-500 tracking-widest hover:text-emerald-600 transition-colors cursor-pointer">COOP. CHINCHA</span>
                  <span className="text-xs font-black text-slate-500 tracking-widest hover:text-emerald-600 transition-colors cursor-pointer">AVÍCOLA ICA</span>
                  <span className="text-xs font-black text-slate-500 tracking-widest hover:text-emerald-600 transition-colors cursor-pointer">AGRO VALLE LINDOS</span>
                  <span className="text-xs font-black text-slate-500 tracking-widest hover:text-emerald-600 transition-colors cursor-pointer">GRANJA SAN JOSÉ</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- IMPACT STATS SECTION --- */}
      <section className="bg-emerald-900 py-16 text-white relative z-20 shadow-inner">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <p className="text-5xl font-black text-[#f2d58a]">98.6%</p>
            <p className="mt-2 text-sm font-bold uppercase tracking-wider text-emerald-200">Precisión del Conteo Visual IA</p>
            <p className="mt-1 text-xs text-emerald-100/70">Detecta automáticamente huevos sanos y merma rota</p>
          </div>
          <div className="border-y border-emerald-800 py-6 md:border-y-0 md:border-x md:py-0 md:px-6">
            <p className="text-5xl font-black text-[#f2d58a]">24/7</p>
            <p className="mt-2 text-sm font-bold uppercase tracking-wider text-emerald-200">Monitoreo y Alertas IA</p>
            <p className="mt-1 text-xs text-emerald-100/70">Detección temprana de anomalías en tu lote al instante</p>
          </div>
          <div>
            <p className="text-5xl font-black text-[#f2d58a]">+15%</p>
            <p className="mt-2 text-sm font-bold uppercase tracking-wider text-emerald-200">Retorno de Utilidad Pecuaria</p>
            <p className="mt-1 text-xs text-emerald-100/70">Evita pérdidas de alimento y optimiza la venta</p>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="demostracion" className="bg-slate-50 py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Potencia el control de tu producción</h2>
            <p className="text-slate-600 text-lg">Pqcuario integra inteligencia de punta adaptada a las necesidades reales del avicultor regional.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Bot}
              title="IAVet Multimodal"
              description="Habla con tu asesor experto en aves. Responde preguntas críticas sobre manejo, dosificación y sanidad por voz, fotos o chat."
            />
            <FeatureCard 
              icon={BarChart3}
              title="Visión de Calidad"
              description="Toma una foto de la bandeja de recolección. La IA cuenta automáticamente los huevos y reporta fisuras o roturas al instante."
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Planificación y Rutinas"
              description="Controla las tareas de vacunación, limpieza y alimentación de tus galpones con calendarios inteligentes y automatizados."
            />
            <FeatureCard 
              icon={TrendingUp}
              title="Calculadora Pecuaria"
              description="Monitorea tus costos operativos diarios y proyecta tu utilidad neta mensual según los precios reales de venta de huevo."
            />
            <FeatureCard 
              icon={Zap}
              title="Alertas de Bioseguridad"
              description="Anticípate a riesgos de Newcastle o Influenza Aviar con sugerencias oficiales de prevención y manejo."
            />
            <FeatureCard 
              icon={HeartPulse}
              title="Historial de Lotes"
              description="Archiva registros acumulativos de postura para entender el comportamiento y rendimiento histórico de tu galpón."
            />
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="bg-white py-24 relative z-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs text-emerald-600 font-extrabold uppercase tracking-widest">Testimonios de Campo</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4 tracking-tight">Aprobado por productores avícolas</h2>
            <p className="text-slate-600">Conoce la experiencia de quienes ya optimizan sus granjas con Pqcuario en el departamento de Ica.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
              <Quote size={48} className="text-emerald-200 absolute top-4 right-4" />
              <p className="text-slate-700 font-medium italic leading-relaxed mb-6">
                "Pqcuario nos ha permitido tener un control preciso de la producción y finanzas de nuestros galpones. IAVet nos ayuda a diagnosticar de forma inmediata y a proyectar el consumo de alimento de manera muy sencilla."
              </p>
              <div>
                <p className="text-sm font-black text-slate-900">Carlos Mendoza</p>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Productor Avícola · Chincha</p>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
              <Quote size={48} className="text-emerald-200 absolute top-4 right-4" />
              <p className="text-slate-700 font-medium italic leading-relaxed mb-6">
                "El conteo automático de huevos por foto nos ahorra más de 30 minutos de conteo manual diario por galpón. IAVet detecta de inmediato huevos rotos y merma que a veces pasábamos por alto. Ha sido una inversión increíble."
              </p>
              <div>
                <p className="text-sm font-black text-slate-900">Lucía Ramos</p>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Administradora de Granja · Ica</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- AUTH MODAL --- */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => !isLoading && setShowLogin(false)}
          />
          <div className="bg-white w-full max-w-md p-8 rounded-2xl relative z-10 animate-slide-up shadow-2xl border border-slate-100">
            <button 
              onClick={() => setShowLogin(false)}
              disabled={isLoading}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <Bot size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                {isSignUp ? 'Crea tu cuenta' : 'Bienvenido de vuelta'}
              </h3>
              <p className="text-slate-500 text-sm">
                {isSignUp ? 'Únete a Pqcuario e IAVet hoy' : 'Ingresa a tu cuenta para continuar'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-sm animate-shake">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contraseña</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {isSignUp ? 'Creando cuenta...' : 'Autenticando...'}
                  </>
                ) : (
                  isSignUp ? 'Crear Cuenta' : 'Ingresar a la Plataforma'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                disabled={isLoading}
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                {isSignUp ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
