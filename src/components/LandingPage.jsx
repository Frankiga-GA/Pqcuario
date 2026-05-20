import { useState } from 'react';
import { ShieldCheck, Bot, HeartPulse, X, ArrowRight, Activity, Zap, Loader2, PlayCircle, BarChart3, TrendingUp, CheckCircle2, AlertCircle, Quote, Camera, Cpu, LineChart, Star, Globe, MessageCircle, Share2, Mail, MapPin, Phone, Bird, Feather } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-2xl border-2 border-slate-200/80 shadow-lg shadow-slate-200/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-900/10 hover:border-emerald-500 group relative overflow-hidden flex flex-col justify-between">
      {/* Top glowing decorative accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div>
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-600">
          <Icon size={26} className="text-emerald-600 transition-colors duration-300 group-hover:text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
      </div>
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

            {/* Right Column: Interactive Orbiting Ecosystem */}
            <div className="hidden lg:flex relative w-full h-[500px] items-center justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              
              <style>{`
                @keyframes orbit-spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes counter-spin {
                  from { transform: rotate(360deg); }
                  to { transform: rotate(0deg); }
                }
                .orbit-container {
                  animation: orbit-spin 40s linear infinite;
                }
                .orbit-item {
                  animation: counter-spin 40s linear infinite;
                }
                .orbit-container:hover, .orbit-container:hover .orbit-item {
                  animation-play-state: paused;
                }
                .egg-shape {
                  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                }
              `}</style>

              {/* Background Glows */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

              {/* The Orbiting Rings */}
              {/* Outer Ring */}
              <div className="absolute w-[450px] h-[450px] rounded-full border border-emerald-500/20 orbit-container flex items-center justify-center">
                {/* Orbit Item 1: Egg */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 orbit-item group cursor-pointer z-30">
                  <div className="relative">
                    {/* Glow */}
                    <div className="absolute inset-0 bg-emerald-400 blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
                    {/* Egg */}
                    <div className="w-12 h-16 bg-gradient-to-br from-white via-orange-50 to-amber-100 shadow-xl border border-white/50 egg-shape flex items-center justify-center relative z-10 transform transition-transform group-hover:scale-110">
                      <Bot size={16} className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-52 bg-white/95 backdrop-blur-md text-slate-800 text-xs p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-emerald-100 shadow-2xl shadow-emerald-900/20">
                      <span className="font-black text-emerald-700 block mb-1.5 uppercase tracking-wide text-[10px]">Análisis de Huevos</span>
                      <p className="font-medium leading-relaxed">Conteo automático y detección de merma por visión artificial IAVet.</p>
                    </div>
                  </div>
                </div>

                {/* Orbit Item 2: Bird */}
                <div className="absolute top-1/2 -right-6 -translate-y-1/2 orbit-item group cursor-pointer z-30">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md shadow-xl border border-emerald-100 flex items-center justify-center transform transition-transform group-hover:scale-110">
                      <Bird size={24} className="text-emerald-600" />
                    </div>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 w-52 bg-white/95 backdrop-blur-md text-slate-800 text-xs p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-emerald-100 shadow-2xl shadow-emerald-900/20">
                      <span className="font-black text-emerald-700 block mb-1.5 uppercase tracking-wide text-[10px]">Salud del Galpón</span>
                      <p className="font-medium leading-relaxed">Monitoreo de bioseguridad, mortalidad y peso promedio de tus aves.</p>
                    </div>
                  </div>
                </div>

                {/* Orbit Item 3: Golden Egg */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 orbit-item group cursor-pointer z-30">
                  <div className="relative">
                    <div className="w-12 h-16 bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 shadow-xl border border-amber-200/50 egg-shape flex items-center justify-center relative z-10 transform transition-transform group-hover:scale-110">
                      <TrendingUp size={16} className="text-amber-900" />
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-52 bg-white/95 backdrop-blur-md text-slate-800 text-xs p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-amber-200 shadow-2xl shadow-amber-900/20">
                      <span className="font-black text-amber-600 block mb-1.5 uppercase tracking-wide text-[10px]">Proyección de Rentabilidad</span>
                      <p className="font-medium leading-relaxed">Calcula tus márgenes diarios y optimiza la venta final según el mercado.</p>
                    </div>
                  </div>
                </div>

                {/* Orbit Item 4: Feather */}
                <div className="absolute top-1/2 -left-6 -translate-y-1/2 orbit-item group cursor-pointer z-30">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md shadow-xl border border-emerald-100 flex items-center justify-center transform transition-transform group-hover:scale-110">
                      <Feather size={24} className="text-emerald-600" />
                    </div>
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 w-52 bg-white/95 backdrop-blur-md text-slate-800 text-xs p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-emerald-100 shadow-2xl shadow-emerald-900/20">
                      <span className="font-black text-emerald-700 block mb-1.5 uppercase tracking-wide text-[10px]">Manejo de Lotes</span>
                      <p className="font-medium leading-relaxed">Gestión de limpieza, cronograma de vacunas e historial por galpón.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inner Ring */}
              <div className="absolute w-[280px] h-[280px] rounded-full border border-emerald-500/30 orbit-container flex items-center justify-center" style={{ animationDuration: '25s', animationDirection: 'reverse' }}>
                {/* Floating Data Points inside inner ring */}
                <div className="absolute -top-4 left-1/4 orbit-item" style={{ animationDirection: 'reverse', animationDuration: '25s' }}>
                  <div className="bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md border border-emerald-200">
                    +98.6% Precisión
                  </div>
                </div>
                <div className="absolute bottom-10 -right-4 orbit-item" style={{ animationDirection: 'reverse', animationDuration: '25s' }}>
                  <div className="bg-amber-50 text-amber-800 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md border border-amber-200 flex items-center gap-1.5">
                    <AlertCircle size={12} className="text-amber-600" />
                    Alerta Sanitaria
                  </div>
                </div>
              </div>

              {/* Center Core: The AI Brain / Pqcuario Logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 cursor-default">
                <div className="relative w-40 h-40 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl shadow-emerald-900/20 border-4 border-white flex items-center justify-center group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/50 to-teal-50/50" />
                  {/* Pulsing rings inside */}
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-30" style={{ animationDuration: '3s' }} />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/40 mb-2 transform transition-transform duration-500 group-hover:rotate-12">
                      <Bot size={32} className="text-white" />
                    </div>
                    <span className="font-black text-slate-900 text-sm tracking-wide">IAVET</span>
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Motor Neural</span>
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

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="bg-slate-50 py-24 relative z-20 border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs text-emerald-600 font-extrabold uppercase tracking-widest">Flujo de Trabajo</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4 tracking-tight">¿Cómo funciona Pqcuario?</h2>
            <p className="text-slate-600">Un proceso diseñado para ser ejecutado directamente desde el galpón, sin complicaciones técnicas.</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-emerald-100 via-emerald-300 to-emerald-100 border-t border-dashed border-emerald-400 z-0" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-emerald-50 shadow-xl shadow-emerald-900/5 flex items-center justify-center mb-6">
                <Camera size={40} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Toma la Foto</h3>
              <p className="text-slate-600 text-sm">El galponero toma una fotografía rápida a la bandeja de huevos recién recolectada desde su celular.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-emerald-50 shadow-xl shadow-emerald-900/5 flex items-center justify-center mb-6">
                <Cpu size={40} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Análisis IAVet</h3>
              <p className="text-slate-600 text-sm">Nuestra IA procesa la imagen en 3 segundos, contando huevos sanos y detectando merma rota o sucia.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-emerald-50 shadow-xl shadow-emerald-900/5 flex items-center justify-center mb-6">
                <LineChart size={40} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Optimiza Utilidades</h3>
              <p className="text-slate-600 text-sm">Los datos se sincronizan con tu panel financiero para calcular márgenes de ganancia y reducir costos de alimento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section className="bg-white py-24 relative z-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs text-emerald-600 font-extrabold uppercase tracking-widest">Planes Accesibles</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4 tracking-tight">Elige el plan ideal para tu granja</h2>
            <p className="text-slate-600">Tecnología de clase mundial a un costo adaptado a la avicultura regional.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* Basic Plan */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-slate-300 transition-all">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Básico</h3>
              <div className="text-4xl font-black text-slate-900 mb-6">Gratis</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> 1 Galpón</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Calculadora Básica</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> 50 Escaneos IA / mes</li>
                <li className="flex items-center gap-3 text-sm text-slate-400"><X size={18} className="shrink-0" /> Multi-usuario</li>
              </ul>
              <button 
                onClick={() => setShowLogin(true)}
                className="w-full py-3 rounded-xl font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                Comenzar Básico
              </button>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="bg-emerald-900 rounded-3xl p-8 border-2 border-emerald-400 shadow-2xl shadow-emerald-900/30 relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-900 text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full flex items-center gap-1 shadow-lg">
                <Star size={12} className="fill-slate-900" /> Más Popular
              </div>
              <h3 className="text-lg font-bold text-emerald-50 mb-2">Pro Pecuario</h3>
              <div className="text-4xl font-black text-white mb-2">$29<span className="text-lg font-medium text-emerald-300">/mes</span></div>
              <p className="text-emerald-200/80 text-xs mb-6 border-b border-emerald-800 pb-6">Facturado anualmente</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-emerald-50"><CheckCircle2 size={18} className="text-emerald-400 shrink-0" /> Hasta 10 Galpones</li>
                <li className="flex items-center gap-3 text-sm text-emerald-50"><CheckCircle2 size={18} className="text-emerald-400 shrink-0" /> Calculadora Avanzada + Proyección</li>
                <li className="flex items-center gap-3 text-sm text-emerald-50"><CheckCircle2 size={18} className="text-emerald-400 shrink-0" /> Escaneos IA Ilimitados</li>
                <li className="flex items-center gap-3 text-sm text-emerald-50"><CheckCircle2 size={18} className="text-emerald-400 shrink-0" /> Asistente IAVet por Voz</li>
                <li className="flex items-center gap-3 text-sm text-emerald-50"><CheckCircle2 size={18} className="text-emerald-400 shrink-0" /> Soporte Prioritario</li>
              </ul>
              <button 
                onClick={() => setShowLogin(true)}
                className="w-full py-3.5 rounded-xl font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-400/20 transition-colors"
              >
                Prueba Pro Gratis por 14 días
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-slate-300 transition-all">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Empresarial</h3>
              <div className="text-4xl font-black text-slate-900 mb-6">Personalizado</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Galpones Ilimitados</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Roles Multi-usuario Avanzados</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Exportación de Reportes Financieros</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Implementación en Sitio</li>
              </ul>
              <button 
                onClick={() => setShowLogin(true)}
                className="w-full py-3 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Contactar Ventas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 pt-20 pb-10 relative z-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
            {/* Brand Col */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-white leading-none">Pqcuario</h1>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Transformando la avicultura en el sur chico del Perú mediante inteligencia artificial y visión computacional accesible.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-400/50 transition-colors">
                  <Globe size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-400/50 transition-colors">
                  <Share2 size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-400/50 transition-colors">
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6">Enlaces Rápidos</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Inicio</a></li>
                <li><a href="#demostracion" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Planes y Precios</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Casos de Éxito</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-6">Contacto</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-slate-400">
                  <MapPin size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Av. Panamericana Sur Km 298, Ica, Perú</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-400">
                  <Phone size={18} className="text-emerald-500 shrink-0" />
                  <span>+51 987 654 321</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-400">
                  <Mail size={18} className="text-emerald-500 shrink-0" />
                  <span>hola@pqcuario.com</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-bold mb-6">Boletín Avícola</h4>
              <p className="text-slate-400 text-sm mb-4">Recibe tips de manejo y alertas sanitarias regionales mensuales.</p>
              <form className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Tu correo" 
                  className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full"
                />
                <button type="button" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 py-2.5 transition-colors">
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs">© 2026 Pqcuario. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Privacidad</a>
              <a href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Términos</a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- AUTH MODAL --- */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => !isLoading && setShowLogin(false)}
          />
          <div className="bg-white w-full max-w-md rounded-2xl relative z-10 animate-slide-up shadow-2xl shadow-slate-900/20 border border-slate-100 overflow-hidden">
            {/* Illustrated Banner Header */}
            <div className="relative h-32 w-full bg-slate-900 overflow-hidden">
              <img 
                src="/aviculture_hero_bg.png" 
                alt="Pqcuario Farm Banner" 
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent"></div>
              
              <button 
                onClick={() => setShowLogin(false)}
                disabled={isLoading}
                className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors disabled:opacity-50 z-10 backdrop-blur-md"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 pt-0">
              {/* Overlapping Logo */}
              <div className="text-center mb-8 -mt-10 relative z-20">
                <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-xl shadow-slate-200/50 mx-auto mb-4 border border-slate-100">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center border border-emerald-100/50">
                    <Bot size={36} className="text-emerald-600 drop-shadow-sm" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1.5 tracking-tight">
                  {isSignUp ? 'Crea tu cuenta' : 'Bienvenido de vuelta'}
                </h3>
                <p className="text-slate-500 text-sm font-medium">
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
        </div>
      )}
    </div>
  );
}
