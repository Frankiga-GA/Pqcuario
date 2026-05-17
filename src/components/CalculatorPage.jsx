import { Calculator, TrendingUp, Wallet } from 'lucide-react';
import EggCalculator from './EggCalculator';

export default function CalculatorPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <section className="rounded-2xl border border-[#d6a84f]/25 bg-[linear-gradient(135deg,#12372a,#2f7d4b_58%,#4a5b2d)] p-4 text-white shadow-xl shadow-[#12372a]/15 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#f2d58a]/25 bg-[#f2d58a]/10 px-3 py-1 text-xs font-black text-[#f2d58a]">
              <Calculator size={13} />
              Calculadora financiera
            </div>
            <h2 className="text-xl font-black sm:text-3xl">Huevos, costos y utilidad</h2>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-slate-300">
              Simula produccion, ventas por huevo o bandeja, costos, margen y punto de equilibrio para tomar mejores decisiones.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:min-w-64">
            <div className="rounded-xl border border-[#f2d58a]/15 bg-white/[0.08] p-3">
              <Wallet size={17} className="mb-2 text-emerald-200" />
              <p className="text-[11px] font-bold uppercase text-slate-400">Modo</p>
              <p className="text-sm font-black">Offline</p>
            </div>
            <div className="rounded-xl border border-[#f2d58a]/15 bg-white/[0.08] p-3">
              <TrendingUp size={17} className="mb-2 text-amber-200" />
              <p className="text-[11px] font-bold uppercase text-slate-400">Uso</p>
              <p className="text-sm font-black">Proyeccion</p>
            </div>
          </div>
        </div>
      </section>

      <EggCalculator />
    </div>
  );
}
