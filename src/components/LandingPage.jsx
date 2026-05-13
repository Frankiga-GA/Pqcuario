import { useState } from 'react';
import { ShieldCheck, Bot, HeartPulse, X, ArrowRight, Activity, Zap, Loader2, PlayCircle, BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

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

export default function LandingPage({ onLogin }) {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState('admin@petguide.pe');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="relative min-h-screen flex flex-col z-10 w-full bg-white animate-fade-in font-sans">
      
      {/* --- HERO SECTION WITH VIDEO BACKGROUND --- */}
      <div className="relative min-h-[90vh] flex flex-col justify-between">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover"
          >
            {/* Stock video placeholder (agriculture/fields) */}
            <source src="https://cdn.pixabay.com/video/2022/10/24/136224-764516982_large.mp4" type="video/mp4" />
          </video>
          {/* Light overlay to ensure text readability */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>
        </div>

        {/* Navbar */}
        <nav className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <HeartPulse size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-tight tracking-tight">PetGuide</h1>
              <span className="text-xs text-emerald-600 font-bold tracking-widest uppercase">Agro IA</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="hidden sm:block text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors px-4 py-2">
              Soluciones
            </button>
            <button className="hidden sm:block text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors px-4 py-2">
              Mercados
            </button>
            <button 
              onClick={() => setShowLogin(true)}
              className="bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold px-6 py-2.5 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Iniciar Sesión
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-100 shadow-sm text-emerald-700 text-xs font-bold mb-8 animate-slide-up">
            <Activity size={14} className="text-emerald-600" />
            <span className="uppercase tracking-wide">Plataforma Inteligente Nº1</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight animate-slide-up leading-[1.1]" style={{ animationDelay: '0.1s' }}>
            Transforma el cuidado animal con <span className="text-emerald-600">Inteligencia Artificial</span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto mb-10 leading-relaxed animate-slide-up font-medium" style={{ animationDelay: '0.2s' }}>
            Conectamos productores, veterinarios y cuidadores. Accede a diagnósticos preventivos, reportes de SENASA y monitoreo en tiempo real desde una sola plataforma.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up w-full sm:w-auto" style={{ animationDelay: '0.3s' }}>
            <button 
              onClick={() => setShowLogin(true)}
              className="bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-lg px-8 py-3.5 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/30 hover:-translate-y-0.5"
            >
              Comenzar gratis
              <ArrowRight size={18} />
            </button>
            <button className="bg-white text-slate-800 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-bold text-lg px-8 py-3.5 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2 transition-all shadow-sm">
              <PlayCircle size={18} className="text-emerald-600" />
              Ver demostración
            </button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-sm font-semibold text-slate-500 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500"/> Sin tarjeta de crédito</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500"/> Cancelación libre</div>
            <div className="hidden sm:flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500"/> Soporte 24/7</div>
          </div>
        </main>
      </div>

      {/* --- FEATURES SECTION --- */}
      <section className="bg-slate-50 py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Todo lo que necesitas en un solo lugar</h2>
            <p className="text-slate-600 text-lg">Nuestra plataforma integra las mejores herramientas del mercado para optimizar tu granja o clínica veterinaria.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Bot}
              title="VetCoach IA 24/7"
              description="Asistente inteligente entrenado con protocolos veterinarios oficiales para resolver dudas de nutrición y primeros auxilios al instante."
            />
            <FeatureCard 
              icon={BarChart3}
              title="Gestión y Análisis"
              description="Lleva el historial clínico, controla el peso, edad y tratamientos de cada animal. Genera reportes predictivos de salud."
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Alertas Oficiales"
              description="Integración de alertas sanitarias en tiempo real de SENASA y recordatorios de vacunación obligatoria."
            />
            <FeatureCard 
              icon={TrendingUp}
              title="Mercado en Vivo"
              description="Monitorea precios de insumos, forraje y ganado en los principales mercados locales para tomar decisiones rentables."
            />
            <FeatureCard 
              icon={Zap}
              title="Pronósticos Precisos"
              description="Anticípate a los cambios del clima y el mercado con nuestros algoritmos de Machine Learning."
            />
            <FeatureCard 
              icon={HeartPulse}
              title="Bienestar Animal"
              description="Score de bienestar calculado automáticamente en base al historial médico y la frecuencia de chequeos."
            />
          </div>
        </div>
      </section>

      {/* --- LOGIN MODAL --- */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                <HeartPulse size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Bienvenido de vuelta</h3>
              <p className="text-slate-500 text-sm">Ingresa a tu cuenta para continuar</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
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
                    Autenticando...
                  </>
                ) : (
                  'Ingresar a la Plataforma'
                )}
              </button>
            </form>
            
            <p className="text-center text-xs text-slate-500 mt-6 bg-slate-50 p-3 rounded-lg">
              Demostración: Usa las credenciales predeterminadas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
