import { useEffect, useMemo, useState } from 'react';
import { Calculator, RotateCcw, Save } from 'lucide-react';
import {
  DEFAULT_CALCULATOR_VALUES,
  getCalculatorValues,
  STORAGE_EVENTS,
  writeCalculatorValues,
} from '../lib/storage';

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function EggCalculator({ compact = false }) {
  const [values, setValues] = useState(getCalculatorValues);
  const [saved, setSaved] = useState(false);

  const result = useMemo(() => {
    const dailyEggs = toNumber(values.dailyEggs);
    const eggPrice = toNumber(values.eggPrice);
    const traySize = Math.max(1, toNumber(values.traySize));
    const monthDays = Math.max(1, toNumber(values.monthDays));
    const feedCost = toNumber(values.feedCost);
    const otherCosts = toNumber(values.otherCosts);
    const flockSize = Math.max(1, toNumber(values.flockSize));
    const lossRate = Math.min(100, Math.max(0, toNumber(values.lossRate)));

    const grossEggs = dailyEggs * monthDays;
    const sellableEggs = Math.round(grossEggs * (1 - lossRate / 100));
    const trays = sellableEggs / traySize;
    const dailyIncome = dailyEggs * eggPrice * (1 - lossRate / 100);
    const monthlyIncome = sellableEggs * eggPrice;
    const totalCosts = feedCost + otherCosts;
    const netProfit = monthlyIncome - totalCosts;
    const margin = monthlyIncome > 0 ? (netProfit / monthlyIncome) * 100 : 0;
    const eggsPerBird = dailyEggs / flockSize;
    const breakEvenEggs = eggPrice > 0 ? Math.ceil(totalCosts / eggPrice) : 0;
    const breakEvenDaily = Math.ceil(breakEvenEggs / monthDays);

    return {
      grossEggs,
      sellableEggs,
      trays,
      dailyIncome,
      monthlyIncome,
      totalCosts,
      netProfit,
      margin,
      eggsPerBird,
      breakEvenEggs,
      breakEvenDaily,
    };
  }, [values]);

  useEffect(() => {
    writeCalculatorValues(values);
  }, [values]);

  useEffect(() => {
    const handleSync = (event) => {
      setSaved(false);
      setValues((prev) => ({ ...prev, ...event.detail }));
    };

    window.addEventListener(STORAGE_EVENTS.calculator, handleSync);
    return () => window.removeEventListener(STORAGE_EVENTS.calculator, handleSync);
  }, []);

  const updateValue = (field, value) => {
    setSaved(false);
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const resetValues = () => {
    setSaved(false);
    setValues(DEFAULT_CALCULATOR_VALUES);
  };

  const saveSnapshot = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields = [
    { id: 'dailyEggs', label: 'Huevos diarios', suffix: 'und', step: 1 },
    { id: 'eggPrice', label: 'Precio por huevo', prefix: 'S/', step: 0.01 },
    { id: 'traySize', label: 'Huevos por bandeja', suffix: 'und', step: 1 },
    { id: 'monthDays', label: 'Dias del mes', suffix: 'dias', step: 1 },
    { id: 'feedCost', label: 'Costo alimento', prefix: 'S/', step: 1 },
    { id: 'otherCosts', label: 'Otros costos', prefix: 'S/', step: 1 },
    { id: 'flockSize', label: 'Cantidad de aves', suffix: 'aves', step: 1 },
    { id: 'lossRate', label: 'Merma', suffix: '%', step: 1 },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            <Calculator size={13} />
            Calculadora de huevos
          </div>
          <h3 className="text-lg font-black text-slate-900">Produccion, bandejas y utilidad</h3>
          {!compact && (
            <p className="mt-1 text-sm font-medium text-slate-500">
              Calcula ingresos, costos, margen y punto de equilibrio para tu lote.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={resetValues}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-800"
          title="Reiniciar calculadora"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2">
          {fields.map((field) => (
            <label key={field.id} className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase text-slate-500">{field.label}</span>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                {field.prefix && <span className="text-sm font-black text-slate-500">{field.prefix}</span>}
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step={field.step}
                  value={values[field.id]}
                  onChange={(e) => updateValue(field.id, e.target.value)}
                  className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm font-black text-slate-900 outline-none"
                />
                {field.suffix && <span className="text-xs font-bold text-slate-400">{field.suffix}</span>}
              </div>
            </label>
          ))}
        </div>

        <div className="rounded-2xl border border-[#12372a] bg-[linear-gradient(180deg,#12372a,#1f4f35)] p-4 text-white">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Huevos vendibles', value: result.sellableEggs.toLocaleString('es-PE') },
              { label: 'Bandejas', value: result.trays.toFixed(1) },
              { label: 'Ingreso mes', value: `S/ ${result.monthlyIncome.toFixed(2)}` },
              { label: 'Utilidad neta', value: `S/ ${result.netProfit.toFixed(2)}` },
              { label: 'Margen', value: `${result.margin.toFixed(1)}%` },
              { label: 'Punto equilibrio', value: `${result.breakEvenDaily} huevos/dia` },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-[#f2d58a]/15 bg-white/[0.08] p-3">
                <p className="text-[11px] font-bold uppercase text-slate-400">{item.label}</p>
                <p className="mt-1 text-base font-black text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-[#9bc5a8]/25 bg-[#2f7d4b]/20 p-3">
            <p className="text-xs font-black uppercase text-[#cde8d0]">Lectura IA</p>
            <p className="mt-2 text-xs font-medium leading-relaxed text-slate-300">
              Cada ave produce {result.eggsPerBird.toFixed(2)} huevos/dia. Para cubrir costos necesitas vender al menos{' '}
              {result.breakEvenEggs.toLocaleString('es-PE')} huevos al mes.
            </p>
          </div>

          <button
            type="button"
            onClick={saveSnapshot}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700"
          >
            <Save size={16} />
            {saved ? 'Calculo guardado' : 'Guardar calculo'}
          </button>
        </div>
      </div>
    </section>
  );
}
