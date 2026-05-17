import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CalendarDays, CheckCircle2, Egg, Plus, TrendingDown } from 'lucide-react';
import {
  getProductionRecords,
  STORAGE_EVENTS,
  syncCalculatorDailyEggs,
  upsertProductionRecord,
} from '../lib/storage';

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
  });
}

export default function DailyProduction() {
  const [records, setRecords] = useState(getProductionRecords);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    eggs: 35,
    damaged: 1,
    note: '',
  });
  const [saved, setSaved] = useState(false);

  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [records],
  );

  const lastSeven = sortedRecords.slice(-7);
  const maxEggs = Math.max(...lastSeven.map((record) => Number(record.eggs)), 1);
  const latest = lastSeven.at(-1);
  const previousAverage = lastSeven.length > 1
    ? lastSeven.slice(0, -1).reduce((sum, record) => sum + Number(record.eggs), 0) / (lastSeven.length - 1)
    : Number(latest?.eggs || 0);
  const dropPercent = previousAverage > 0 && latest
    ? ((previousAverage - Number(latest.eggs)) / previousAverage) * 100
    : 0;
  const damagedRate = latest ? (Number(latest.damaged || 0) / Math.max(1, Number(latest.eggs))) * 100 : 0;
  const hasProductionAlert = dropPercent >= 10;
  const hasDamageAlert = damagedRate >= 5;

  useEffect(() => {
    const handleSync = (event) => setRecords(event.detail);
    window.addEventListener(STORAGE_EVENTS.production, handleSync);
    return () => window.removeEventListener(STORAGE_EVENTS.production, handleSync);
  }, []);

  const updateForm = (field, value) => {
    setSaved(false);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const eggs = Math.max(0, Number(form.eggs) || 0);
    const damaged = Math.max(0, Number(form.damaged) || 0);
    const newRecord = {
      id: form.date,
      date: form.date,
      eggs,
      damaged,
      note: form.note || 'Registro manual',
    };

    const nextRecords = upsertProductionRecord(newRecord);
    setRecords(nextRecords);
    syncCalculatorDailyEggs(eggs);
    setSaved(true);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            <Egg size={13} />
            Produccion diaria
          </div>
          <h3 className="text-lg font-black text-slate-900">Registrar huevos y generar alertas</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Guarda el registro real del dia y alimenta automaticamente la calculadora.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
          <CalendarDays size={14} />
          Ultimos 7 dias
        </span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Fecha</span>
              <input
                type="date"
                value={form.date}
                onChange={(event) => updateForm('date', event.target.value)}
                className="input-field bg-white"
                required
              />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Huevos recogidos</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={form.eggs}
                onChange={(event) => updateForm('eggs', event.target.value)}
                className="input-field bg-white"
                required
              />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Rotos / no vendibles</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={form.damaged}
                onChange={(event) => updateForm('damaged', event.target.value)}
                className="input-field bg-white"
              />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Observacion</span>
              <input
                value={form.note}
                onChange={(event) => updateForm('note', event.target.value)}
                className="input-field bg-white"
                placeholder="Ej: calor, poca agua, normal..."
              />
            </label>
          </div>

          <button type="submit" className="btn-primary mt-4 w-full justify-center">
            {saved ? <CheckCircle2 size={16} /> : <Plus size={16} />}
            {saved ? 'Registro guardado' : 'Guardar produccion'}
          </button>
        </form>

        <div className="rounded-2xl border border-[#12372a] bg-[linear-gradient(180deg,#12372a,#1f4f35)] p-4 text-white">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-white">Grafica de produccion</p>
              <p className="text-xs font-medium text-[#b7cbbd]">Huevos recogidos por dia.</p>
            </div>
            <span className="rounded-full bg-[#f2d58a]/10 px-2.5 py-1 text-xs font-black text-[#f2d58a]">
              {latest?.eggs || 0} hoy
            </span>
          </div>

          <div className="flex h-40 items-end gap-2">
            {lastSeven.map((record) => {
              const height = Math.max(14, (Number(record.eggs) / maxEggs) * 100);
              const isLatest = record.id === latest?.id;
              return (
                <div key={record.id} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div className="flex h-32 w-full items-end justify-center rounded-lg bg-white/[0.05] px-1">
                    <div
                      className={isLatest ? 'w-full max-w-8 rounded-t-lg bg-[#f2d58a]' : 'w-full max-w-8 rounded-t-lg bg-[#71b87b]'}
                      style={{ height: `${height}%` }}
                      title={`${record.eggs} huevos`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{formatDate(record.date)}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#f2d58a]/15 bg-white/[0.08] p-3">
              <p className="text-[11px] font-bold uppercase text-slate-400">Promedio previo</p>
              <p className="mt-1 text-lg font-black text-white">{previousAverage.toFixed(1)}</p>
            </div>
              <div className="rounded-xl border border-[#f2d58a]/15 bg-white/[0.08] p-3">
              <p className="text-[11px] font-bold uppercase text-slate-400">Cambio</p>
              <p className="mt-1 text-lg font-black text-white">{dropPercent.toFixed(1)}%</p>
            </div>
              <div className="rounded-xl border border-[#f2d58a]/15 bg-white/[0.08] p-3">
              <p className="text-[11px] font-bold uppercase text-slate-400">Merma hoy</p>
              <p className="mt-1 text-lg font-black text-white">{damagedRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {(hasProductionAlert || hasDamageAlert) && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-amber-700">
            {hasProductionAlert ? <TrendingDown size={16} /> : <AlertTriangle size={16} />}
            <p className="text-sm font-black">Alerta automatica</p>
          </div>
          <p className="text-sm font-medium leading-relaxed text-slate-700">
            {hasProductionAlert
              ? 'La produccion bajo mas de 10% frente al promedio reciente. Revisa agua, alimento, temperatura y horas de luz.'
              : 'La merma esta alta. Revisa nidos, manipulacion de huevos y traslado hacia almacenamiento.'}
          </p>
        </div>
      )}
    </section>
  );
}
